// @todo extract enum to separate file
export enum ClientTypeEnum {
    CONFIDENTAL = 1,
    PUBLIC
} 

export type ClientId = string;

export class Client {
    id: ClientId;
    
    constructor(
        public name: string,
        public websiteURL: string,
        public redirectUri: string,
        public secret: string,
        public type: ClientTypeEnum = ClientTypeEnum.PUBLIC
    ) {
    }
}
