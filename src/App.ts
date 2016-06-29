import * as Hapi from "hapi";
import * as redis from "redis";
import * as Promise from "promise";
import * as winston from "winston";
import * as yargs from "yargs";
import * as swig from "swig";
import * as uuid from "node-uuid";

import {ServiceContainer} from "./service/ServiceContainer";
import {Config} from "./model/Config";
import {UuidGenerator} from "./service/uuidGenerator/UuidGenerator";
import * as routes from "./route/index";
import {BCryptPasswordHasher} from "./service/passwordHasher/BCryptPasswordHasher";
import {ClientDataMapperRedis} from "./dataMapper/redis/ClientDataMapperRedis";
import {UserDataMapperRedis} from "./dataMapper/redis/UserDataMapperRedis";
import {CodeDataMapperRedis} from "./dataMapper/redis/CodeDataMapperRedis";

export class App {
    protected container: ServiceContainer = null;
    protected redisClient: redis.RedisClient = null;
    protected server: Hapi.Server = null;
    
    constructor(
        protected config: Config
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
        
        this.container = new ServiceContainer({
            config: config,
            redisClient: this.redisClient,
            logger: logger,
            clientDataMapper: new ClientDataMapperRedis(this.redisClient),
            userDataMapper: new UserDataMapperRedis(this.redisClient),
            codeDataMapper: new CodeDataMapperRedis(this.redisClient),
            uuidGenerator: new UuidGenerator(),
            passwordHasher: new BCryptPasswordHasher(),
        });
    }
    
    protected tearDownDbConnection() {
        this.redisClient.quit();
    }
    
    private getConfiguredRoutes(): Hapi.IRouteConfiguration[] {
        let c = this.container;
        return [
            routes.indexGET(c.getLogger()),
            routes.clientGET(c.getClientDataMapper()),
            routes.clientPOST(c.getClientBuilder(), this.container.getClientDataMapper()),
            routes.authGET(c.getClientDataMapper()),
            routes.authPOST(c.getClientDataMapper(), c.getCodeManager(), c.getUserDataMapper(), c.getPasswordHasher())
        ];
    }

    startHttpServer(): Promise.IThenable<any> {
        return new Promise<any>((resolve, reject) => {
            this.container.getLogger().debug(`Starting http server on port ${this.config.http.port}`);
            
            this.server = new Hapi.Server(<any>{
                debug:  {
                    request: ['error', 'debug', 'all']
                }
            });
            this.server.register(require('vision'), (err) => {
                if (err) {
                    console.log("Failed to load vision.");
                }
            });
            
            this.server.connection({port: this.config.http.port});
            this.server.views({
                engines: {
                    html: swig
                },
                path: "./src/template" // @todo put in config
            });
            this.server.route(this.getConfiguredRoutes());
            
            this.server.start((err) => {
                if (err) {
                    return reject(err);
                }

                this.container.getLogger().debug("Server started");
                return resolve(null);
            });
        }).then<any>(null, (err) => {
            this.tearDownDbConnection();
            throw err;
        })
    };

    stopHttpServer(): Promise.IThenable<any> {
        return Promise.resolve(this.server.stop());
    }

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
                let clientBuilder = this.container.getClientBuilder()();
                clientBuilder.setName(argv.name);
                clientBuilder.setRedirectUri(argv.redirectUri);
                
                clientBuilder.getResult().then((client) => {
                    return this.container.getClientDataMapper().insert(client).then(() => {
                        console.log("Created client");
                        console.log(client);
                        this.tearDownDbConnection();
                    });
                })
            })
            
            .command("client:delete", "Delete client", (yargs: yargs.Argv) => {
                return yargs.demand("id");
            }, (argv: any) => {
                console.log("delete client", argv);
                this.tearDownDbConnection();
            })

            .command("user:create", "Create new user", (yargs: yargs.Argv) => {
                return yargs
                    .demand("username")
                    .demand("password")
                    ;
            }, (argv: any) => {
                let userBuilder = this.container.getUserBuilder()();
                userBuilder.setEmail(argv.username);
                userBuilder.setPassword(argv.password);

                userBuilder.getResult().then((user) => {
                    return this.container.getUserDataMapper().insert(user).then(() => {
                        console.log("Created user");
                        console.log(user);
                        this.tearDownDbConnection();
                    });
                })
            })
            
            .argv;
    }
    
}
