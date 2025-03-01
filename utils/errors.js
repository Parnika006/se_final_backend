const invalidData = 400; // bad request
const documentNotFound = 404;
const defaultError = 500;
const duplicateError = 409;
const authenticationError = 401;
const forbidden = 403;

const errorHandling = (err, res) => {
  console.error(err);
  if (err.code === 11000) {
    return res.status(duplicateError).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(invalidData).send({ message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(invalidData).send({ message: err.message });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(documentNotFound).send({ message: err.message });
  }
  if (err.message === "Incorrect email or password") {
    return res.status(authenticationError).send({ message: err.message });
  }
  return res
    .status(defaultError)
    .send({ message: "An error has occurred on the server" });
};

module.exports = {
  errorHandling,
  invalidData,
  documentNotFound,
  defaultError,
  forbidden,
  duplicateError,
  authenticationError,
};
