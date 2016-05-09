export class Client {
    constructor(
        private name: string,
        private websiteURL: string,
        private redirectUri: string,
        private clientID: string,
        private clientSecret: string
    ) {
    }
}