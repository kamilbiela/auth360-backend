import * as Hapi from "hapi";
import * as redis from "redis";
import {Promise} from "es6-promise";
import * as winston from "winston";

import {ServiceContainer} from "./model/ServiceContainer";
import {Config} from "./model/config";
import {ClientDataMapperRedis} from "./dataMapper/redis/clientDataMapper";
import * as routes from "./route/index";

export class App {
    container: ServiceContainer = null;
    
    constructor(
        private config: Config
    ) {
        let redisClient = redis.createClient();

        let logger = new (winston.Logger)({
            level: config.debug.level,
            transports: [
                new (winston.transports.Console)()
            ]
        });

        let clientDataMapper = new ClientDataMapperRedis(redisClient);

        this.container = new ServiceContainer(
            config,
            redisClient,
            logger,
            clientDataMapper
        );
    }
    
    private getConfiguredRoutes(): Hapi.IRouteConfiguration[] {
        return [
			routes.clientGET(this.container.getClientDataMapper()),
        ];
    }

    startHttpServer(): Promise<boolean> {
        this.getConfiguredRoutes();
        const server = new Hapi.Server();
	
		return new Promise<any>((resolve, reject) => {
			server.connection({port: this.config.http.port});
			
			server.start((err) => {
				if (err) {
					return reject(err);
				}

				console.log(`Started server on port ${this.config.http.port}` );
				return resolve();
			})
		})
    };
}
