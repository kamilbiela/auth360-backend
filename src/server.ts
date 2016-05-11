import * as Hapi from "hapi";
import * as Promise from "promise";
import {ServiceContainer} from "./model/ServiceContainer";
    
function startServer(container: ServiceContainer): Promise.IThenable<boolean> {
    return new Promise((resolve, reject) => {
        let config = container.getConfig();
        
        const server = new Hapi.Server();
        server.connection({port: config.http.port});

        server.start((err) => {
            if (err) {
                return reject(err);
            }
            
            console.log(`Started server on port ${config.http.port}` );
            return resolve(true);
        })
    });
};

export default startServer;
