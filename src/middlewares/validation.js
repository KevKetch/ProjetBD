const Joi = require('joi');

exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.error('[Validation Error]', error.details.map(d => d.message));
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.details.map(d => d.message),
      });
    }
    next();
  };
};
