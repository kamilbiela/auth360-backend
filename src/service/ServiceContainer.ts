import * as redis from "redis";
import {ClientBuilder} from "./builder/ClientBuilder.ts";
import {Config} from "../model/Config";
import {IClientDataMapper, IUserDataMapper} from "./dataMapper";
import {IRedisClient, ILogger, IUuidGenerator} from "./index";
import {IPasswordHasher} from "./IPasswordHasher";
import {CodeBuilder} from "./builder/CodeBuilder";
import {UserBuilder} from "./builder/UserBuilder";
import {ICodeDataMapper} from "./dataMapper/ICodeDataMapper";
import {CodeManager} from "./manager/CodeManager";
import {Client} from "../model/client";
import {AccessTokenManager} from "./manager/AccessTokenManager";
import {IAccessTokenDataMapper} from "./dataMapper/IAccessTokenDataMapper";
import {AccessTokenBuilder} from "./builder/AccessTokenBuilder";

interface ServiceContainerParams {
    config: Config;
    redisClient: IRedisClient;
    logger: ILogger;
    clientDataMapper: IClientDataMapper;
    uuidGenerator: IUuidGenerator;
    userDataMapper: IUserDataMapper;
    passwordHasher: IPasswordHasher;
    codeDataMapper: ICodeDataMapper;
    accessTokenDataMapper: IAccessTokenDataMapper;
}

export class ServiceContainer {
    private codeManager: CodeManager;
    private accessTokenManager: AccessTokenManager;

    constructor(
        private containerParams: ServiceContainerParams
    ) {
    }

    // @see this.getCodeManager
    private getCodeBuilder(): () => CodeBuilder {
        return () => {
            return new CodeBuilder(this.getUuidGenerator());
        }
    }

    private getAccessTokenBuilder(): () => AccessTokenBuilder {
        return () => {
            return new AccessTokenBuilder(this.getUuidGenerator());
        }
    }

    getClientBuilder(): () => ClientBuilder {
        return () => {
            return new ClientBuilder(this.getUuidGenerator())
        };
    }

    getUserBuilder(): () => UserBuilder {
        return () => {
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

    getAccessTokenManager(): AccessTokenManager {
        if (!this.accessTokenManager) {
            this.accessTokenManager = new AccessTokenManager(this.getAccessTokenDataMapper(), this.getAccessTokenBuilder());
        }

        return this.accessTokenManager;
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

    getAccessTokenDataMapper(): IAccessTokenDataMapper {
        return this.containerParams.accessTokenDataMapper;
    }

    getUuidGenerator(): IUuidGenerator {
        return this.containerParams.uuidGenerator;
    }

    getPasswordHasher(): IPasswordHasher {
        return this.containerParams.passwordHasher;
    }
}
