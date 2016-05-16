import {Client, ClientTypeEnum} from "./Client";

export class ClientBuilder {
    private id: string = null;
    private name: string = null;
    private websiteURI: string = null;
    private redirectURI: string = null;

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
    
    setId(id: string): void {
        this.id = id;
    }

    getResult(): Client {
        return new Client(
            this.name,
            this.websiteURI,
            this.redirectURI,
            this.id !== null ? this.id : "" + Math.round(Math.random() * 10000000), //@todo fix this
            "" + Math.round(Math.random() * 10000000), //@todo fix this
            ClientTypeEnum.PUBLIC // @todo v2 add support for confidental clients
        )
    }
}