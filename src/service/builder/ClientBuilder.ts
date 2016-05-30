import {Client, ClientTypeEnum} from "../../model/Client";
import * as _ from "lodash";

export class ClientBuilder {
    private name: string = null;
    private websiteUrl: string = null;
    private redirectURI: string = null;

    setName(name: string): void {
        this.name = name;
    }

    setWebsiteURL(websiteUrl: string): void {
        this.websiteUrl = websiteUrl;
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
        
        return {
            id: null,
            name: this.name,
            websiteUrl: this.websiteUrl,
            redirectUri: this.redirectURI,
            secret: "" + Math.round(Math.random() * 10000000), //@todo fix this
            type: ClientTypeEnum.PUBLIC // @todo v2 add support for confidental clients
        }
    }
}
