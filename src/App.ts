import * as Hapi from "hapi";
import * as redis from "redis";
import {Promise} from "es6-promise";
import * as winston from "winston";
import * as yargs from "yargs";
import * as swig from "swig";

import {ServiceContainer} from "./model/ServiceContainer";
import {Config} from "./model/config";
import {ClientDataMapperRedis} from "./dataMapper/redis/ClientDataMapperRedis";
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
            routes.clientPOST(c.getClientBuilderInstance(), this.container.getClientDataMapper()),
            routes.authGET()
        ];
    }

    startHttpServer(): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            this.container.getLogger().debug(`Starting http server on port ${this.config.http.port}`);
            
            const server = new Hapi.Server(<any>{
                debug:  {
                    request: ['error', 'debug', 'all']
                }
            });
            server.register(require('vision'), (err) => {
                if (err) {
                    console.log("Failed to load vision.");
                }
            });
            
            server.connection({port: this.config.http.port});
            server.views({
                engines: {
                    html: swig
                },
                path: "./src/template" // @todo put in config
            })
            server.route(this.getConfiguredRoutes());
            
            server.start((err) => {
                if (err) {
                    return reject(err);
                }

                this.container.getLogger().debug("Server started");
                return resolve();
            })
        }).then<any>(null, (err) => {
            this.tearDown();
            throw err;
        })
    };

    startCli(): void {
        // @todo move to separate class
        // @todo convert to promises, move command handling out of "command" methods
        
        let argv = (<any>yargs)
            .command("client:create", "Create new client", (yargs: yargs.Argv) => {
                return yargs
                    .demand("name")
                    .demand("redirectUri")
                ;
            }, (argv: any) => {
                let clientBuilder = this.container.getClientBuilderInstance();
                clientBuilder.setName(argv.name);
                clientBuilder.setRedirectUri(argv.redirectUri);
                clientBuilder.setId(argv.id || null);
                
                let client = clientBuilder.getResult();
                this.container.getClientDataMapper().insert(client).then(() => {
                    this.tearDown();
                });
            })
            
            .command("client:delete", "Delete client", (yargs: yargs.Argv) => {
                return yargs.demand("id");
            }, (argv: any) => {
                console.log("delete client", argv);
                this.tearDown();
            })
            .argv;
    }
}
