const router = require("express").Router();
const {
  createArticle,
  getArticle,
  deleteArticle,
} = require("../controllers/articles");

const auth = require("../middlewares/auth");

router.post("/", auth, createArticle);

router.get("/", auth, getArticle);

router.delete("/:articleId", auth, deleteArticle);

module.exports = router;
