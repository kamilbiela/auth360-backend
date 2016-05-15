import * as Hapi from "hapi";
import {serviceContainer} from "../service/serviceContainer";
import {Client} from "../model/Client";

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
            let clientBuilder = serviceContainer.getClientBuilderInstance();
            
            clientBuilder.setName(request.payload["name"]);
            clientBuilder.setRedirectUri(request.payload["redirectUri"]);
            clientBuilder.setWebsiteURL(request.payload["websiteURL"]);
            let client = clientBuilder.getResult();
            
            clientDataMapper.insertOrUpdateClient(client).then(() => {
                return reply(client);
            }).catch((err) => {
                return reply(err);
            })
        }
    }
];

export default routes;
