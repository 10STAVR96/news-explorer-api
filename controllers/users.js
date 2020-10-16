const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictDataError = require('../errors/conflict-data-err');
const LoginError = require('../errors/login-err');
const { jwtDefault } = require('../utils/config');
const { notFoundUser } = require('../utils/const');

const { NODE_ENV, JWT_SECRET = 'dev-key' } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError(notFoundUser);
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcript.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(201).send({ _id: user._id, email }))
    .catch((err) => next(new ConflictDataError(err)));
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtDefault,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(new LoginError(err.message)));
};
