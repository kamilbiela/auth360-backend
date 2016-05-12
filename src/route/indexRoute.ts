import * as Hapi from "hapi";
import {serviceContainer} from "../service/serviceContainer";

let route:Hapi.IRouteConfiguration = {
    method: "GET",
    path: "/",
    handler: (request, reply) => {
        serviceContainer.getLogger().log("debug", "Hello from index");
        reply('hello');
    }
};

export default route;
