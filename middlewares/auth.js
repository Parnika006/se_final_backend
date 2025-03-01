const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const AuthenticationError = require("../errors/authentication-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthenticationError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next(new AuthenticationError("Authorization Required"));
  }

  req.user = payload;
  return next();
};
