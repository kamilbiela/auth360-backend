import {Client, ClientTypeEnum} from "./Client";
import * as _ from "lodash";

export class ClientBuilder {
    private name: string = null;
    private websiteURI: string = null;
    private redirectURI: string = null;

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
        if (_.isEmpty(this.name)) {
            throw new Error("Client name can't be empty");
        }
        
        if (_.isEmpty(this.redirectURI)) {
            throw new Error("Client redirect uri can't be empty");
        }
        
        return new Client(
            this.name,
            this.websiteURI,
            this.redirectURI,
            "" + Math.round(Math.random() * 10000000), //@todo fix this
            ClientTypeEnum.PUBLIC // @todo v2 add support for confidental clients
        )
    }
}