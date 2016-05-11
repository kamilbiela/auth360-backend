import * as redis from "redis";
import {ClientBuilder} from "./clientBuilder.ts";

export class ServiceContainer {
    constructor(
        protected redisClient: redis.RedisClient
    ) {
    }
    
    getClientBuilderInstance(): ClientBuilder {
        return new ClientBuilder();
    }
    
    getRedisClient(): redis.RedisClient {
        if (this.redisClient === null) {
            this.redisClient = redis.createClient();
        }
        
        return this.redisClient;
    }
}
