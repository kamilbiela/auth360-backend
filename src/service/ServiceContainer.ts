import * as redis from "redis";
import {ClientBuilder} from "./builder/ClientBuilder.ts";
import {Config} from "../model/Config";
import {IClientDataMapper, IUserDataMapper} from "./dataMapper";
import {IRedisClient, ILogger, IUuidGenerator} from "./index";
import {IPasswordHasher} from "./IPasswordHasher";

interface ServiceContainerParams {
    config: Config;
    redisClient: IRedisClient;
    logger: ILogger;
    clientDataMapper: IClientDataMapper;
    uuidGenerator: IUuidGenerator;
    userDataMapper: IUserDataMapper;
    passwordHasher: IPasswordHasher;
}

export class ServiceContainer {
    constructor(
        private containerParams: ServiceContainerParams
    ) {
    }
    
    getClientBuilderInstance(): ClientBuilder {
        return new ClientBuilder();
    }
    
    getRedisClient(): IRedisClient {
        if (this.containerParams.redisClient === null) {
            this.containerParams.redisClient = redis.createClient();
        }
        
        return this.containerParams.redisClient;
    }
    
    getConfig(): Config {
        return this.containerParams.config;
    }
    
    getLogger(): ILogger {
        return this.containerParams.logger;
    }
    
    getClientDataMapper(): IClientDataMapper {
        return this.containerParams.clientDataMapper;
    }
    
    getUserDataMapper(): IUserDataMapper {
        return this.containerParams.userDataMapper
    }
    
    getUuidGenerator(): IUuidGenerator {
        return this.containerParams.uuidGenerator;
    }
    
    getPasswordHasher(): IPasswordHasher {
        return this.containerParams.passwordHasher;
    }
}
