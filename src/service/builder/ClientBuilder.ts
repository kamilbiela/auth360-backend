import {Client, ClientTypeEnum} from "../../model/Client";
import * as _ from "lodash";
import {IUuidGenerator} from "../IUuidGenerator";
import {Promise} from "es6-promise";

export class ClientBuilder {
    private name: string = null;
    private websiteUrl: string = null;
    private redirectURI: string = null;

    constructor(
        private uuidGenerator: IUuidGenerator
    ) {
    }
    
    setName(name: string): void {
        this.name = name;
    }

    setWebsiteURL(websiteUrl: string): void {
        this.websiteUrl = websiteUrl;
    }

    setRedirectUri(redirectURI: string): void {
        this.redirectURI = redirectURI;
    }
    
    getResult(): Promise<Client> {
        return new Promise((resolve) => {
            if (_.isEmpty(this.name)) {
                throw new Error("Client name can't be empty");
            }
            
            if (_.isEmpty(this.redirectURI)) {
                throw new Error("Client redirect uri can't be empty");
            }
            
            return resolve({
                id: this.uuidGenerator.generate(),
                name: this.name,
                websiteUrl: this.websiteUrl,
                redirectUri: this.redirectURI,
                secret: this.uuidGenerator.generate(),
                // @todo v2 add support for confidental clients
                type: ClientTypeEnum.PUBLIC 
            });
        })
    }
}
