export enum ClientTypeEnum {
    CONFIDENTAL = 1,
    PUBLIC
} 

export class Client {
    constructor(
        private name: string,
        private websiteURL: string,
        private redirectUri: string,
        private id: string,
        private secret: string,
        private type: ClientTypeEnum = ClientTypeEnum.PUBLIC
    ) {
    }
}
