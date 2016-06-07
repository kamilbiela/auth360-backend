import * as Promise from "promise";
import {App} from "../src/App";
import {ServiceContainer} from "../src/service/ServiceContainer";
import {configLoader} from "../src/configLoader";

export const data = {
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
    
    loadUser(): Promise.IThenable<any> {
        let userBuilder = this.getContainer().getUserBuilder()();
        userBuilder.setEmail(data.user.username);
        userBuilder.setPassword(data.user.password);

        return userBuilder.getResult()
            .then(user => this.container.getUserDataMapper().insert(user))
        ;
    }
}

export let startApp = (): AppTest => {
    let config = configLoader();
    return new AppTest(config);
};

export let appInstance = startApp();
before(() => appInstance.beforeAll());
beforeEach(() => appInstance.beforeEach());
after(() => appInstance.afterAll());
