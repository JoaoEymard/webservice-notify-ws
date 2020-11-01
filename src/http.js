const routes = require("express").Router();

const subscribe = require("./subscribe");

routes.get("/sendmessage", (req, res, next) => {
  try {
    subscribe.emit("wsSendMessage", req.query, (message) => {
      res.json(message);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = routes;
