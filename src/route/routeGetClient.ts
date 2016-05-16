import {IRoute} from "./IRoute";
import {IClientDataMapper} from "../dataMapper/IClientDataMapper";

export let route: IRoute = (clientDataMapper: IClientDataMapper) => {
    return {
        method: "GET",
        path: `/api/client/{id}`,
        handler: (request, reply) => {
            clientDataMapper.getById(request.params["id"]).then(reply);
        }
    }
};

    // {
    //     method: "POST",
    //         path: `${commonPath}/{id}`,
    //     handler: (request, reply) => {
    //     let clientBuilder = serviceContainer.getClientBuilderInstance();
	//
    //     clientBuilder.setName(request.payload["name"]);
    //     clientBuilder.setRedirectUri(request.payload["redirectUri"]);
    //     clientBuilder.setWebsiteURL(request.payload["websiteURL"]);
    //     let client = clientBuilder.getResult();
	//
    //     clientDataMapper.insertOrUpdateClient(client).then(() => {
    //         return reply(client);
    //     }).catch((err) => {
    //         return reply(err);
    //     })
    // }
    // }
