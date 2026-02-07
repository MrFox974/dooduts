const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 10;

class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {{ user: object, accessToken: string, refreshToken: string }}
   */
  async register(username, email, password) {
    const emailTrimmed = email.toLowerCase().trim();
    const usernameTrimmed = username.trim();

    const existingEmail = await User.findOne({
      where: { email: emailTrimmed },
    });
    if (existingEmail) {
      throw new Error('Un compte existe déjà avec cette adresse email.');
    }

    const existingUsername = await User.findOne({
      where: { username: usernameTrimmed },
    });
    if (existingUsername) {
      throw new Error('Ce nom d\'utilisateur est déjà pris.');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      username: usernameTrimmed,
      email: emailTrimmed,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await this.createTokens(user.id);
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: { id: user.id, username: user.username, email: user.email },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Connexion d'un utilisateur
   * @param {string} email
   * @param {string} password
   * @returns {{ user: object, accessToken: string, refreshToken: string }}
   */
  async login(email, password) {
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    const { accessToken, refreshToken } = await this.createTokens(user.id);
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rafraîchit le token d'accès à partir du refresh token (cookie ou body)
   * @param {string} refreshToken
   * @returns {{ accessToken: string }}
   */
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token manquant.');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error('Refresh token expiré ou invalide.');
    }

    const user = await User.findByPk(decoded.user_id);
    if (!user || user.refresh_token !== refreshToken) {
      throw new Error('Refresh token invalide.');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.createTokens(user.id);
    await this.saveRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Crée les tokens JWT
   * @private
   */
  async createTokens(userId) {
    const accessToken = jwt.sign(
      { user_id: userId },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { user_id: userId, jti: crypto.randomBytes(16).toString('hex') },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    return { accessToken, refreshToken };
  }

  /**
   * Sauvegarde le refresh token en base
   * @private
   */
  async saveRefreshToken(userId, refreshToken) {
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
  }
}

module.exports = new AuthService();
