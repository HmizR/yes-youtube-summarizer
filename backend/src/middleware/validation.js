const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Custom validators
exports.summaryValidators = [
  body('videoUrl').isURL().withMessage('Valid YouTube URL is required'),
  body('videoUrl').custom(value => {
    if (!value.includes('youtube.com') && !value.includes('youtu.be')) {
      throw new Error('URL must be a YouTube video');
    }
    return true;
  })
];

exports.authValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];