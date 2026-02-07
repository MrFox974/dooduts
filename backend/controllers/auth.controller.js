const authService = require('../services/auth.service');

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

/**
 * Inscription
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Le nom d\'utilisateur, l\'email et le mot de passe sont requis.',
      });
    }

    const usernameTrimmed = username.trim();
    if (usernameTrimmed.length < 3) {
      return res.status(400).json({
        error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.',
      });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return res.status(400).json({
        error: 'Format d\'email invalide.',
      });
    }

    const passwordRules = [
      { test: (p) => p.length >= 8, error: 'Le mot de passe doit contenir au moins 8 caractères.' },
      { test: (p) => /[A-Z]/.test(p), error: 'Le mot de passe doit contenir au moins une majuscule.' },
      { test: (p) => /[a-z]/.test(p), error: 'Le mot de passe doit contenir au moins une minuscule.' },
      { test: (p) => /\d/.test(p), error: 'Le mot de passe doit contenir au moins un chiffre.' },
      { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), error: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).' },
    ];
    for (const rule of passwordRules) {
      if (!rule.test(password)) {
        return res.status(400).json({ error: rule.error });
      }
    }

    const result = await authService.register(usernameTrimmed, emailTrimmed, password);

    res.cookie('refreshToken', result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message?.includes('existe déjà') || error.message?.includes('déjà pris')) {
      return res.status(409).json({ error: error.message });
    }
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      details: error.message,
    });
  }
};

/**
 * Connexion
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'L\'email et le mot de passe sont requis.',
      });
    }

    const result = await authService.login(email.trim().toLowerCase(), password);

    res.cookie('refreshToken', result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message?.includes('incorrect') || error.message?.includes('invalide')) {
      return res.status(401).json({ error: error.message });
    }
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      details: error.message,
    });
  }
};

/**
 * Rafraîchissement du token
 */
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    const result = await authService.refresh(refreshToken);

    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    }
    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken || undefined,
    });
  } catch (error) {
    if (error.message?.includes('manquant') || error.message?.includes('expiré') || error.message?.includes('invalide')) {
      return res.status(401).json({ error: error.message });
    }
    console.error('Erreur lors du refresh:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      details: error.message,
    });
  }
};
