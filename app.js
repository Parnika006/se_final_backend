const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
require("dotenv").config();

const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { login, createUser } = require("./controllers/users");
const limiter = require("./utils/rateLimiter");
const errorHandler = require("./middlewares/error-handler");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/news_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(limiter);
app.use(helmet());

app.use(express.json());
// app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000", // Replace with production domain
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(requestLogger); // before routes

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.use(errorLogger); // before the other error handlers
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
