const Article = require("../models/article");
const ForbiddenError = require("../errors/forbidden-error");

const BadRequestError = require("../errors/bad-request-err");

const NotFoundError = require("../errors/not-found-err");

/* const createArticle = (req, res, next) => {
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
}; */

const createArticle = (req, res, next) => {
  const { article, searchQuery } = req.body;

  if (!article || !searchQuery) {
    return next(new BadRequestError("Missing article data or search query"));
  }

  // Remove `source.id` if it exists as its always null
  if (article.source) {
    delete article.source.id;
  }

  return Article.create({ ...article, searchQuery }) // ✅ Explicitly return the Promise
    .then((savedArticle) => res.send({ data: savedArticle }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        ); // ✅ Add return
      }
      return next(err); // ✅ Add return to satisfy ESLint
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

  Article.findById(articleId)
    .orFail()
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        console.error(
          "Permission denied! Article owner ID:",
          article.owner,
          "Logged-in user ID:",
          req.user._id
        );
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return Article.findByIdAndDelete();
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
