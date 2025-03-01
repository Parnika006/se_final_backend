const router = require("express").Router();
const userRouter = require("./users");
const articleRouter = require("./articles");

router.use("/users", userRouter);
router.use("/articles", articleRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
