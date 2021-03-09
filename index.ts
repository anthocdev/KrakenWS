const express = require("express");
import * as https from "https";
import * as http from "http";
const app = express();
const path = require("path");
import * as fs from "fs";
import WebSocketServer from "./websocket";
const dotenv = require("dotenv");
dotenv.config();

let _server = null;

if (process.env.NODE_ENV == "development") {
  //HTTP For development
  _server = http.createServer(app);
} else {
  /* SSL Certs (Will be symlinked in same dir) */
  const key = fs.readFileSync(path.resolve(__dirname, "./privkey.pem"));
  const cert = fs.readFileSync(path.resolve(__dirname, "./cert.pem"));
  _server = https.createServer({ key, cert }, app);
}

WebSocketServer.init(_server);

_server.listen(process.env.PORT || 3000, () => {
  console.log(`Server UP on port ${process.env.port}`);
});
