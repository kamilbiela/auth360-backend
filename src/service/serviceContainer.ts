import * as redis from "redis";
import {ServiceContainer} from "../model/ServiceContainer";
import {loadConfig} from "./configLoader";
import * as winston from "winston";
import {ClientDataMapperRedis} from "../dataMapper/redis/ClientDataMapper";

let config = loadConfig();
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

