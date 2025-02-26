const router = require("express").Router();

router.get("/", () => {
  console.log("GET articles");
});

router.post("/", () => {
  console.log("POST articles");
});

router.delete("/:articleId", () => console.log("delete article"));

module.exports = router;
