require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectToDB, connectModels } = require('./config/database');

const app = express();

// Configuration CORS : accepte uniquement l'origine définie dans CORS_ORIGIN
// Retire le slash final pour matcher l'en-tête Origin envoyé par le navigateur (sans slash)
const allowedOrigin = (process.env.CORS_ORIGIN || 'http://localhost:5173').trim().replace(/\/$/, '');

console.log('CORS Configuration - Allowed Origin:', allowedOrigin);

const isOriginAllowed = (origin) => !origin || origin === allowedOrigin;

// Un seul middleware CORS pour éviter le header Access-Control-Allow-Origin en double
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS check - Origin:', origin, 'Allowed:', allowedOrigin);
    // Pas d'Origin ou origine autorisée → accepter
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require('./models/Test');
require('./models/User');

app.use('/api', require('./router/test.route'));
app.use('/api', require('./router/auth.route'));

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  const origin = req.headers.origin;
  const allowed = (process.env.CORS_ORIGIN || 'http://localhost:5173').trim().replace(/\/$/, '');
  const ok = !origin || origin === allowed;

  // Ajoute les headers CORS même en cas d'erreur
  if (ok && origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// Initialise la connexion DB (non-bloquant pour Lambda)
connectToDB().catch(err => {
  console.error('Failed to connect to database:', err);
});

connectModels({ force: true }).catch(err => {
  console.error('Failed to sync models:', err);
});

module.exports = app