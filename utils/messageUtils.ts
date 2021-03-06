import {Message, Author, AuthorType, ClientMessage} from "../model/websocket"

export function SimpleDateTime(): string{
    var date = new Date();
    var dateString =
    date.getUTCFullYear() + "/" +
    ("0" + (date.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + date.getUTCDate()).slice(-2) + " " +
    ("0" + date.getUTCHours()).slice(-2) + ":" +
    ("0" + date.getUTCMinutes()).slice(-2) + ":" +
    ("0" + date.getUTCSeconds()).slice(-2);

    return dateString;
}

export function UserMessage(msg: any){
    var parsedMessage: ClientMessage = JSON.parse(msg.toString());
    
    var FullMessage: Message = {
        body: parsedMessage.message,
        author: {name: parsedMessage.author, type: AuthorType.User},
        createdAt: SimpleDateTime(),
    }
    return FullMessage;
}

export function ServerMessage(message: string): Message{
    var FullMessage = {
        body: message,
        author: {name: "Mini Kraken", type: AuthorType.Server},
        createdAt: SimpleDateTime()
    }
    
    return FullMessage;
}