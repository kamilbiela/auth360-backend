import * as redis from "redis";
import * as ini from "ini";
import * as fs from "fs";

import {ServiceContainer} from "./service/ServiceContainer";

import {Config} from "./model/config";

function loadConfig(): Config {
    let configStr = fs.readFileSync("config.ini").toString();
    let config = ini.decode(configStr);
	return <Config>config;
}

config.http.port = 4123;

let redisClient = redis.createClient();

export let serviceContainer = new ServiceContainer(
	redisClient
);

