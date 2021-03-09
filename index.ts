const express = require("express");
import * as http from "http";
const app = express();

import * as ws from "ws";
import WebSocketServer from "./websocket";

const _server = http.createServer(app);
WebSocketServer.init(_server);
// this._server.on("upgrade", function upgrade(request, socket, head){

// })

_server.listen(process.env.PORT || 3000, () => {
  console.log(`Server UP on port ${_server.address()}`);
});
