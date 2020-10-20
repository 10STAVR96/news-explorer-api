const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { jwtDefault } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const err = new Error('Необходима авторизация');
  err.statusCode = 401;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(err);
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtDefault);
  } catch (e) {
    next(err);
  }
  req.user = payload;
  next();
};
