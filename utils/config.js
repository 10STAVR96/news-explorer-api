const jwtDefault = 'dev-key';
const mongooseAdress = 'mongodb://localhost:27017/news';
const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

module.exports = {
  jwtDefault,
  mongooseAdress,
  mongooseOptions,
};
