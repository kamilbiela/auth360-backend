import * as Hapi from "hapi";
import {ILogger} from "../service/ILogger";

export let route = (logger: ILogger) => {
    return {
        method: "GET",
        path: "/",
        handler: (request, reply) => {
            logger.log("debug", "Hello from index");
            reply('hello');
        }
    };
};
