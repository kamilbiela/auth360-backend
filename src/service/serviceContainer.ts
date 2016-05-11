import * as redis from "redis";
import {ServiceContainer} from "../model/ServiceContainer";
import {loadConfig} from "./configLoader";

let config = loadConfig();
let redisClient = redis.createClient();

export let serviceContainer = new ServiceContainer(
    config,
    redisClient
);

