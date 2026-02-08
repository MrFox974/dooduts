#!/usr/bin/env node
/**
 * Script de synchronisation des tables en base.
 * À exécuter une fois (local ou CI) pour créer les tables manquantes.
 * Usage: node scripts/sync-db.js
 * Ou avec les variables d'environnement de prod (depuis serverless.yml)
 */
require('dotenv').config();

const { sequelize, connectModels } = require('../config/database');

// Charge les modèles pour qu'ils soient enregistrés
require('../models/Test');
require('../models/User');

async function sync() {
  try {
    console.log('Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('Synchronisation des modèles...');
    await connectModels({ force: false }); // force: false = créer si absent, ne pas supprimer
    console.log('Tables créées avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    process.exit(1);
  }
}

sync();
