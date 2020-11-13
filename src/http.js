const routes = require("express").Router();

const configWs = require("./model/configWs");
const subscribe = require("./subscribe");
// const debugRequest = require("./helpers/debugRequest");

// routes.use("/", debugRequest);

routes.post("/sendmessage", (req, res, next) => {
  try {
    console.log(req.body);
    subscribe.emit("wsSendMessage", req.body, (message, err) => {
      if (err) {
        res.statusCode(500).json(err);
        return;
      }

      res.json(message);
    });
  } catch (error) {
    next(error);
  }
});

// routes.get("/contacts", (req, res, next) => {
//   try {
//     subscribe.emit("wsGetContact", (message) => {
//       res.json(message);
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// routes.get("/chats", (req, res, next) => {
//   try {
//     subscribe.emit("wsGetChats", (message) => {
//       res.json(message);
//     });
//   } catch (error) {
//     next(error);
//   }
// });

routes.get("/isauthenticated", (req, res, next) => {
  if (configWs.isAuthenticated) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = routes;
