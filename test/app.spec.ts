import * as Promise from "promise";
import {App} from "../src/App";
import {ServiceContainer} from "../src/service/ServiceContainer";
import {configLoader} from "../src/configLoader";
import {ClientId, Client} from "../src/model/client";
import {UserId} from "../src/model/User";

export const fixtureData = {
    user: {
        username: "test@test.localhost",
        password: "pass123"
    }
};

export class AppTest extends App {
    getContainer(): ServiceContainer {
        return this.container;
    }

    private flushdb(): Promise.IThenable<any> {
        return new Promise((resolve, reject) => {
            this.redisClient.flushdb((err) => {
               if (err) {
                   return reject(err);
               } 
               return resolve(null); 
            });
        });
    }
    
    beforeAll(): Promise.IThenable<any> {
        return this.flushdb().then(() => this.startHttpServer());
    }
    
    afterAll() : Promise.IThenable<any> {
        return this.stopHttpServer().then(() => this.tearDownDbConnection());
    }
    
    beforeEach(): Promise.IThenable<any> {
        return this.flushdb();
    }
    
    loadUser(username: string = "", password: string = ""): Promise.IThenable<UserId> {
        let userBuilder = this.getContainer().getUserBuilder()();
        userBuilder.setEmail(username || fixtureData.user.username);
        userBuilder.setPassword(password || fixtureData.user.password);

        return userBuilder.getResult()
            .then(user => this.container.getUserDataMapper().insert(user))
        ;
    }
    
    loadClient(redirectUri: string): Promise.IThenable<Client> {
        let clientBuilder = this.getContainer().getClientBuilder()();
        clientBuilder.setName("client-name");
        clientBuilder.setRedirectUri(redirectUri);
        clientBuilder.setWebsiteURL("http://somewebsite.localhost");
       
        let clientPromise = clientBuilder.getResult();
        return clientPromise
            .then(client => this.container.getClientDataMapper().insert(client))
            .then(() => clientPromise);
    }
}

export let startApp = (): AppTest => {
    let config = configLoader();
    return new AppTest(config);
};

before(() => appInstance.beforeAll());
beforeEach(() => appInstance.beforeEach());
after(() => appInstance.afterAll());
export let appInstance = startApp();
