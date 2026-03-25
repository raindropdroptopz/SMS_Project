module.exports = function validateUpload(req, res, next) {
  if (!req.file) {
    const err = new Error("Photo file is required (field name: photo)");
    err.status = 400;
    return next(err);
  }

  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    const err = new Error("Student id must be a number");
    err.status = 400;
    return next(err);
  }

  next();
};