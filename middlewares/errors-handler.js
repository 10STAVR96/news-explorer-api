const { incorrectData, serverError } = require('../utils/const');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message, name } = err;
  if (name === 'ValidationError' || statusCode === 400) {
    res.status(400).send({ message: incorrectData });
    next();
  }
  return res
    .status(statusCode)
    .send({ message: statusCode === 500 ? serverError : message });
};
