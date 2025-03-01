const { Joi, celebrate } = require("celebrate");

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().min(8).message({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateLoggingIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().min(8).message({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateIDs = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24),
  }),
});
