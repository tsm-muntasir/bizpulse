const ApiError = require('../utils/ApiError');

module.exports = function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return next(new ApiError(422, 'Validation failed', 'VALIDATION_ERROR', error.details));
    }

    req[source] = value;
    return next();
  };
};
