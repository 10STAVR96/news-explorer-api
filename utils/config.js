const jwtDefault = 'dev-key';
const { mongooseAdress = 'mongodb://localhost:27017/news' } = process.env;
const { PORT = 3000 } = process.env;
const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

module.exports = {
  jwtDefault,
  mongooseAdress,
  PORT,
  mongooseOptions,
};
