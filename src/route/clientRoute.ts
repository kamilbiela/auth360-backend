import * as Hapi from "hapi";
import {serviceContainer} from "../service/serviceContainer";
import {ClientUpdate} from "../model/Client";

let logger = serviceContainer.getLogger();
let clientDataMapper = serviceContainer.getClientDataMapper();

const commonPath = "/api/client";
let routes: Array<Hapi.IRouteConfiguration> = [
    {
        method: "GET",
        path: `${commonPath}/{id}`,
        handler: (request, reply) => {
            clientDataMapper.getById(request.params["id"]).then(reply);
        }
    },

    {
        method: "POST",
        path: `${commonPath}/{id}`,
        handler: (request, reply) => {

            console.log(request.payload);
            // let clientUpdate: ClientUpdate = {
            //     name: request.body
            // };
            //
            // clientDataMapper.insertOrUpdateClient();
        }
    }
];

export default routes;
