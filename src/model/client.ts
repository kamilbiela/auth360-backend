// @todo extract enum to separate file
export enum ClientTypeEnum {
    CONFIDENTAL = 1,
    PUBLIC
} 

export class Client {
    constructor(
        public name: string,
        public websiteURL: string,
        public redirectUri: string,
        public id: string,
        public secret: string,
        public type: ClientTypeEnum = ClientTypeEnum.PUBLIC
    ) {
    }
}
