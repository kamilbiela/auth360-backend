import * as ini from "ini";
import * as fs from "fs";
import {Config} from "../model/Config";

export let loadConfig = (): Config => {
    let configStr = fs.readFileSync("config.ini").toString();
    let config = ini.decode(configStr);
    return <Config>config;
};

