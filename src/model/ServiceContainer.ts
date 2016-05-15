import * as redis from "redis";
import {ClientBuilder} from "./ClientBuilder.ts";
import {Config} from "./Config";
import {IRedisClient} from "../service/IRedisClient";
import {ILogger} from "../service/ILogger";
import {IClientDataMapper} from "../dataMapper/IClientDataMapper";

export class ServiceContainer {
    constructor(
        private config: Config,
        private redisClient: IRedisClient,
        private logger: ILogger,
        private clientDataMapper: IClientDataMapper
    ) {
    }
    
    getClientBuilderInstance(): ClientBuilder {
        return new ClientBuilder();
    }
    
    getRedisClient(): IRedisClient {
        if (this.redisClient === null) {
            this.redisClient = redis.createClient();
        }
        
        return this.redisClient;
    }
    
    getConfig(): Config {
        return this.config;
    }
    
    getLogger(): ILogger {
        return this.logger;
    }
    
    getClientDataMapper(): IClientDataMapper {
        return this.clientDataMapper;
    }
}
