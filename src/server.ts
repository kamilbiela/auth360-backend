import * as Hapi from "hapi";
import {Promise} from "es6-promise";
import {ServiceContainer} from "./model/ServiceContainer";
import * as hapiRouter from "hapi-router";

// -------------------------------------------------- 
// @todo: make it pretty, chain promises
// -------------------------------------------------- 
function startServer(container: ServiceContainer): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let config = container.getConfig();
        
        const server = new Hapi.Server();

        server.connection({port: config.http.port});
        
        server.register({
            register: hapiRouter,
            options: {
                routes: "src/route/*Route.ts"
            }
        }, err => {
            if (err) {
                throw err;
            }

            server.start((err) => {
                if (err) {
                    return reject(err);
                }

                console.log(`Started server on port ${config.http.port}` );
                return resolve(true);
            })
        });
        
    });
};

export default startServer;
