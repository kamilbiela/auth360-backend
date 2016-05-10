import * as Hapi from "hapi";
import * as Promise from "promise";

import {Config} from "./model/config";

function startServer(config: Config): Promise.IThenable<boolean> {
    return new Promise((resolve, reject) => {
        config;
        const server = new Hapi.Server();

        server.start((err) => {
            if (err) {
                return reject(err);
            }

            return resolve(true);
        })
    });
};

export default startServer;
