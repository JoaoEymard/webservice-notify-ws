require("dotenv").config();

const app = require("./src/app");
const http = require("http").createServer(app);

const port = process.env.PORT || 3000;

require("./src/socket")(http);

require("./src/ws");

http.listen(port, () => {
  console.log("listening on " + port);
});
