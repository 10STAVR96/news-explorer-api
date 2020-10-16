const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { notFoundId, forbiddenError, success } = require('../utils/const');

module.exports.getArticles = (req, res, next) => {
  Article.find(req.user._id)
    .then((articles) => res.send(articles))
    .catch((err) => next(new BadRequestError(err)));
};
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send(article))
    .catch((err) => next(new BadRequestError(err)));
};
module.exports.deleteArticle = (req, res, next) => {
  const owner = req.user._id;
  Article.findOne({ _id: req.params.articleId }).select('+owner')
    .orFail(() => new NotFoundError(notFoundId))
    .then((article) => {
      if (String(article.owner) !== owner) throw new ForbiddenError(forbiddenError);
      return Article.findByIdAndDelete(article._id);
    })
    .then(() => res.send({ message: success }))
    .catch(next);
};
