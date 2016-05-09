import * as Hapi from "hapi";
import * as Promise from "promise";

import {IServiceContainer} from "./IServiceContainer";

let startServer = (serviceContainer: IServiceContainer): Promise.IThenable<boolean> => {
    return new Promise((resolve, reject) => {
        const server = new Hapi.Server();

        server.start((err) => {
            if (err) {
                return reject(err);
            }

            serviceContainer;
            
            return resolve(true);
        })
    });
};

export default startServer;
