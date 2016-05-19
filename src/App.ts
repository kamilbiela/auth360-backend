import * as Hapi from "hapi";
import * as redis from "redis";
import {Promise} from "es6-promise";
import * as winston from "winston";
import * as yargs from "yargs";

import {ServiceContainer} from "./model/ServiceContainer";
import {Config} from "./model/config";
import {ClientDataMapperRedis} from "./dataMapper/redis/clientDataMapper";
import * as routes from "./route/index";

export class App {
    private container: ServiceContainer = null;
    private redisClient: redis.RedisClient = null;
    
    constructor(
        private config: Config
    ) {
        this.initContainer(config);
    }
    
    private initContainer(config: Config) {
        this.redisClient = redis.createClient();

        let logger = new (winston.Logger)({
            level: config.debug.level,
            transports: [
                new (winston.transports.Console)()
            ]
        });

        let clientDataMapper = new ClientDataMapperRedis(this.redisClient);

        this.container = new ServiceContainer(
            config,
            this.redisClient,
            logger,
            clientDataMapper
        );
    }
    
    private tearDown() {
        this.redisClient.quit();
    }
    
    private getConfiguredRoutes(): Hapi.IRouteConfiguration[] {
        let c = this.container;
        return [
            routes.indexGET(c.getLogger()),
            routes.clientGET(c.getClientDataMapper()),
            routes.clientPOST(c.getClientBuilderInstance(), this.container.getClientDataMapper())
        ];
    }

    startHttpServer(): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            const server = new Hapi.Server();
            server.connection({port: this.config.http.port});
            
            server.route(this.getConfiguredRoutes());
            
            server.start((err) => {
                if (err) {
                    return reject(err);
                }

                console.log(`Started server on port ${this.config.http.port}` );
                return resolve();
            })
        })
    };

    startCli(): void {
        let argv = yargs.command("client:create", "Create new client")
            .demand("name")
            .command("client:delete", "Delete client")
            .demand("id")
            .argv;

        console.log(argv);
        this.tearDown();
    }
}
