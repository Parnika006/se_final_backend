const Article = require("../models/article");
const ForbiddenError = require("../errors/forbidden-error");

const BadRequestError = require("../errors/bad-request-err");

const NotFoundError = require("../errors/not-found-err");

const createArticle = (req, res, next) => {
  const {
    source,
    author,
    title,
    description,
    url,
    urlToImage,
    publishedAt,
    content,
  } = req.body;

  Article.create({
    source,
    author,
    title,
    description,
    url,
    urlToImage,
    publishedAt,
    content,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const getArticle = (req, res, next) => {
  Article.find({})
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findByIdAndDelete(articleId)
    .orFail()
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return article.deleteOne();
    })
    .then(() => res.status(200).send({ message: "Successfuly Deleted" }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports = { createArticle, getArticle, deleteArticle };
