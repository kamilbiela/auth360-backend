export class Client {
    constructor(
        public name: string,
        public websiteURL: string,
        public redirectUri: string,
        public id: string,
        public secret: string
    ) {
    }
}