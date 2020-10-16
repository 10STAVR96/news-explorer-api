require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
const auth = require('./middlewares/auth');
const { mongooseAdress, mongooseOptions } = require('./utils/config');
const { incorrectData, serverError } = require('./utils/const');

const app = express();
app.use(cors({ origin: true }));
const { PORT = 3000 } = process.env;

mongoose.connect(mongooseAdress, mongooseOptions);

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/', authRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/articles', articleRouter);

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { // без next обработка ошибок не работает, а eslint ругается
  const { statusCode = 500, message, name } = err;
  if (name === 'ValidationError' || statusCode === 400) return res.status(400).send({ message: incorrectData }); // эта конструкция на случай, если валидация запросов через celebrate каким то образом не сработает
  return res
    .status(statusCode)
    .send({ message: statusCode === 500 ? serverError : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
