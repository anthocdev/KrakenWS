import {Message, AuthorType, ClientMessage, Content, ContentType} from "../model/websocket"

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

export function UserMessage(msg: any): Content{
    var parsedMessage: ClientMessage = JSON.parse(msg.toString());
    
    var FullContent: Content = {
        type: ContentType.Message,
        data: { body: parsedMessage.message, author: {name: parsedMessage.author, type: AuthorType.User}, createdAt: SimpleDateTime()}
    }
    return FullContent;
}

export function ServerMessage(message: string): Content{
    var FullContent: Content = {
        type: ContentType.Message,
        data: {body: message, author: {name: "Mini Kraken", type: AuthorType.Server}, createdAt: SimpleDateTime()}
    }
    
    return FullContent;
}

export function SendHistory(history: Message[]){
    var FullContent: Content = {
        type: ContentType.History,
        data: history
    }

    return FullContent;
}