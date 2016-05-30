import * as redis from "redis";
import {ClientBuilder} from "./builder/ClientBuilder.ts";
import {Config} from "../model/Config";
import {IClientDataMapper, IUserDataMapper} from "./dataMapper";
import {IRedisClient, ILogger, IUuidGenerator} from "./index";
import {IPasswordHasher} from "./IPasswordHasher";
import {CodeBuilder} from "./builder/CodeBuilder";
import {UserBuilder} from "./builder/UserBuilder";
import {ICodeDataMapper} from "./dataMapper/ICodeDataMapper";
import {CodeManager} from "./CodeManager";
import {Client} from "../model/client";

interface ServiceContainerParams {
    config: Config;
    redisClient: IRedisClient;
    logger: ILogger;
    clientDataMapper: IClientDataMapper;
    uuidGenerator: IUuidGenerator;
    userDataMapper: IUserDataMapper;
    passwordHasher: IPasswordHasher;
    codeDataMapper: ICodeDataMapper;
}

export class ServiceContainer {
    private codeManager: CodeManager;
    
    constructor(
        private containerParams: ServiceContainerParams
    ) {
    }

    getClientBuilder(): () => ClientBuilder {
        return function() { 
            return new ClientBuilder(this.getUuidGenerator())
        };
    }

    getCodeBuilder(): () => CodeBuilder {
        return function() {
            return new CodeBuilder(this.getUuidGenerator());
        }
    }
 
    getUserBuilder(): () => UserBuilder {
        return function() {
            return new UserBuilder(this.getUuidGenerator(), this.getPasswordHasher());
        }
    }

    getRedisClient(): IRedisClient {
        if (this.containerParams.redisClient === null) {
            this.containerParams.redisClient = redis.createClient();
        }
        
        return this.containerParams.redisClient;
    }
    
    getCodeManager(): CodeManager {
        if (!this.codeManager) {
            this.codeManager = new CodeManager(this.getCodeDataMapper(), this.getCodeBuilder());
        }
        
        return this.codeManager;
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
        return this.containerParams.userDataMapper;
    }
    
    getCodeDataMapper(): ICodeDataMapper {
        return this.containerParams.codeDataMapper;
    }
    
    getUuidGenerator(): IUuidGenerator {
        return this.containerParams.uuidGenerator;
    }
    
    getPasswordHasher(): IPasswordHasher {
        return this.containerParams.passwordHasher;
    }
}
