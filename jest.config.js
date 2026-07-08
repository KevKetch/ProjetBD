module.exports = {
  // Environnement de test : Node.js (pas de DOM)
  testEnvironment: 'node',

  // Dossiers où Jest va chercher les tests
  roots: ['<rootDir>/src/tests'],

  // Patterns pour les fichiers de test (unitaires et intégration)
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
  ],

  // Ignorer les dossiers node_modules et les dossiers de build
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],

  // Couverture de code (optionnelle)
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/server.js',   // on exclut le point d'entrée
    '!src/config/**',   // on exclut les fichiers de config
    '!src/migrations/**',
    '!src/seeders/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // Gestion des modules (pour les imports ES6 si utilisés)
  // Si vous utilisez des modules ES, décommentez :
  // transform: {},
  // preset: '@babel/preset-env' (si besoin)

  // Pour éviter les problèmes avec les timers asynchrones
  testTimeout: 15000,

  // Nettoyer la base de données entre les tests (optionnel)
  // setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],

  // Reporter pour les résultats
  verbose: true,
};
