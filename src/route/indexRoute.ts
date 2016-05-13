import * as Hapi from "hapi";
import {serviceContainer} from "../service/serviceContainer";

let logger = serviceContainer.getLogger();

let route:Hapi.IRouteConfiguration = {
    method: "GET",
    path: "/",
    handler: (request, reply) => {
        logger.log("debug", "Hello from index");
        reply('hello');
    }
};

export default route;
