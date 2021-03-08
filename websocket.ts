import * as ws from "ws";
import * as http from "http";
import { UserMessage, ServerMessage, SendHistory } from "./utils/messageUtils";
import { Message, Content, ContentType } from "./model/websocket";

export default class WebSocketServer {
  private wssChat: ws.Server;
  private msgHistory: Message[] = []; // Message history
  constructor(appserver: http.Server) {
    this.wssChat = new ws.Server({ server: appserver });
    const conHandler = this.handleConn.bind(this);
    this.wssChat.on("connection", conHandler);
  }

  public static init(appserver: any): WebSocketServer {
    const server: WebSocketServer = new WebSocketServer(appserver);
    console.info("Websocket Server running on port " + appserver);

    return server;
  }

  /* Connection Handling */
  private handleConn(socket: ws): void {
    const messageHandler: (
      socket: ws,
      data: ws.Data
    ) => void = this.handleMessage.bind(this);
    socket.on("message", (data) => messageHandler(socket, data));
    /* To new Client on Connection */
    if (this.msgHistory.length > 0) {
      socket.send(JSON.stringify(SendHistory(this.msgHistory)));
    }
    var welcomeRelay: Content = ServerMessage(
      "Welcome! There are currently " +
        this.wssChat.clients.size +
        " clients connected. Please refrain from spam & immature activity."
    );
    socket.send(JSON.stringify(welcomeRelay));
    /* To all but new Client on Connection */
    var connectedRelay: Content = ServerMessage(
      "New client has connected, with current total of " +
        this.wssChat.clients.size +
        " clients."
    );
    this.wssChat.clients.forEach(function each(client) {
      if (client !== socket && client.readyState == ws.OPEN) {
        client.send(JSON.stringify(connectedRelay));
      }
    });
  }
  /* Message Handling */
  private handleMessage(socket: ws, data: ws.Data): void {
    var relayMsg: Content = UserMessage(data); //Restructure user message for broadcast

    /* Broadcast to sender only in the case of error */
    if (relayMsg.type == ContentType.Error) {
      socket.send(JSON.stringify(relayMsg));
      return;
    }
    /* Storing server/user messages in history */
    this.msgHistory.push(relayMsg.data); //Add to history
    this.msgHistory = this.msgHistory.slice(-10); //Storing no more than last 10 messages
    /* Broadcast to all active users */
    this.wssChat.clients.forEach(function each(client) {
      if (client.readyState == ws.OPEN) {
        client.send(JSON.stringify(relayMsg));
      }
    });
  }

  public quit() {
    this.wssChat.close();
  }
}
