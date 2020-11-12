module.exports = (req, res, next) => {
  console.log("url: ", req.originalUrl);
  console.log("body: ", req.body);
  console.log("params: ", req.params);
  console.log("query: ", req.query);
  console.log("headers: ", req.headers);

  next();
};
