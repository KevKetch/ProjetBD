const { ValidationError } = require('joi');

exports.handleError = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: err.details.map(d => d.message),
    });
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation des données',
      errors: err.errors.map(e => e.message),
    });
  }

  if (err.status) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  return res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
  });
};
