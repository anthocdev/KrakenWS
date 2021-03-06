import * as ws from "ws";
import * as http from "http"
import {UserMessage} from "./utils/messageUtils"

export default class WebSocketServer{
    private wssChat: ws.Server;

    constructor(appserver: http.Server){
        this.wssChat = new ws.Server({server: appserver});
        const conHandler = this.handleConn.bind(this);
        this.wssChat.on("connection", conHandler)
    }

    public static init(appserver: any): WebSocketServer{

        const server: WebSocketServer = new WebSocketServer(appserver)
        console.info('Websocket Server running on port ' + appserver);

        return server;
    }

    /* Connection Handling */
    private handleConn(socket: ws): void {
        const messageHandler: (socket: ws, data: ws.Data) => void = this.handleMessage.bind(this);
        socket.on("message", data => messageHandler(socket, data));
    }
    /* Message Handling */
    private handleMessage(socket: ws, data: ws.Data): void {
        var relayMsg = UserMessage(data) //Restructure user message for broadcast
        /* Broadcast to all active users */
        this.wssChat.clients.forEach(function each(client) {
            if(client.readyState == ws.OPEN){
                client.send(JSON.stringify(relayMsg));
            }
        })
        
    }

    public quit(){
        this.wssChat.close();
    }
}