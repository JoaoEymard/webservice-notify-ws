const express = require("express");
const app = express();

const api = require("./http");

app.use(express.static("public"));
app.use(express.json());

app.use("/api", api);

api.use((err, req, res, next) => {
  res.json(err);
});

module.exports = app;
