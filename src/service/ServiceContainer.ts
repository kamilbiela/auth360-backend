import * as redis from "redis";
import {ClientBuilder} from "builder/ClientBuilder.ts";
import {Config} from "../model/Config";
import {IClientDataMapper, IUserDataMapper} from "./dataMapper";
import {IRedisClient, ILogger, IUuidGenerator} from "./index";
import {IPasswordHasher} from "./IPasswordHasher";

export class ServiceContainer {
    constructor(
        private config: Config,
        private redisClient: IRedisClient,
        private logger: ILogger,
        private clientDataMapper: IClientDataMapper,
        private uuidGenerator: IUuidGenerator,
        private userDataMapper: IUserDataMapper,
        private passwordHasher: IPasswordHasher
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
    
    getUserDataMapper(): IUserDataMapper {
        return this.userDataMapper
    }
    
    getUuidGenerator(): IUuidGenerator {
        return this.uuidGenerator;
    }
    
    getPasswordHasher(): IPasswordHasher {
        return this.passwordHasher;
    }
}
