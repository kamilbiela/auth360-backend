import * as redis from "redis";
import {ClientBuilder} from "./ClientBuilder.ts";
import {Config} from "./Config";
import {IRedisClient} from "../service/IRedisClient";

export class ServiceContainer {
    constructor(
        private config: Config,
        private redisClient: IRedisClient
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
}
