import * as redis from "redis";
import {ServiceContainer} from "../model/ServiceContainer";
import {loadConfig} from "./configLoader";
import * as winston from "winston";
import {ClientDataMapperRedis} from "../dataMapper/redis/ClientDataMapper";
import {Config} from "../model/Config";

let serviceContainer: ServiceContainer = null;

export function getServiceContainer(config: Config = null, forceNewInstance: boolean = false): ServiceContainer {
    if (config === null) {
        config = loadConfig();
    }
    
    let redisClient = redis.createClient();

    let logger = new (winston.Logger)({
        level: config.debug.level,
        transports: [
            new (winston.transports.Console)()
        ]
    });

    let clientDataMapper = new ClientDataMapperRedis(redisClient);

    export let serviceContainer = new ServiceContainer(
        config,
        redisClient,
        logger,
        clientDataMapper
    );

}
