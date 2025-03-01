const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/bad-request-err");
const AuthenticationError = require("../errors/authentication-err");
const ConflictError = require("../errors/conflict-err");
const DocumentNotFoundError = require("../errors/not-found-err");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("All fields are required");
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) =>
      res.status(201).send({ name: user.name, email: user.email })
    )
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("The id string is in an invalid format"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthenticationError("Invalid Email or Password");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => next(err));
};

const getCurrentUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new DocumentNotFoundError("Not Found"));
      } else {
        next(err);
      }
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login };
