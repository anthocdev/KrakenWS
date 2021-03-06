export interface ClientMessage {
    author: string;
    message: string;
  }

export interface Message {
    body: string,
    author: Author,
    createdAt: string,
}

export interface Author {
    name: string,
    type: AuthorType
}
export enum AuthorType {
    Server = 0,
    User = 1
}

