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
const errorsHandler = require('./middlewares/errors-handler');
const { mongooseAdress, PORT, mongooseOptions } = require('./utils/config');

const app = express();
app.use(cors({ origin: true }));

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

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
