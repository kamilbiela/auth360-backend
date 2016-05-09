import {Client} from "../model/client";

export class ClientBuilder {
    name: string;
    websiteURI: string;
    redirectURI: string;

    constructor(
    ) {

    }

    setName(name: string): void {
        this.name = name;
    }

    setWebsiteURL(websiteURI: string): void {
        this.websiteURI = websiteURI;
    }

    setRedirectUri(redirectURI: string): void {
        this.redirectURI = redirectURI;
    }

    getResult(): Client {
        return new Client(
            this.name,
            this.websiteURI,
            this.redirectURI,
            "" + Math.round(Math.random() * 10000000), //@todo fix this
            "" + Math.round(Math.random() * 10000000)  //@todo fix this
        )
    }
}