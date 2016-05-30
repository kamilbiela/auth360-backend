import {IClientDataMapper} from "../service/dataMapper/IClientDataMapper";
import {ClientBuilder} from "../service/builder/ClientBuilder";
import * as Hapi from "hapi";

export let clientGET = (clientDataMapper: IClientDataMapper): Hapi.IRouteConfiguration => {
    return {
        method: "GET",
        path: `/api/client/{id}`,
        handler: (request, reply) => {
            clientDataMapper.getById(request.params["id"]).then(reply);
        }
    }
};

export let clientPOST = (
    clientBuilder: () => ClientBuilder,
    clientDataMapper: IClientDataMapper
): Hapi.IRouteConfiguration => {
    return {
        method: "POST",
        path: `/api/client`,
        handler: (request, reply) => {
            let cb = clientBuilder();
            cb.setName(request.payload["name"]);
            cb.setRedirectUri(request.payload["redirectUri"]);
            cb.setWebsiteURL(request.payload["websiteURL"]);
            
            return cb.getResult().then((client) => {
                return clientDataMapper.insert(client).then(() => {
                    return reply(client);
                }).catch((err) => {
                    return reply(err);
                });
            });
        }
    }
};

export let route = (
    clientBuilder: ClientBuilder,
    clientDataMapper: IClientDataMapper
): Hapi.IRouteConfiguration => {
    return {
        method: "PUT",
        path: `/api/client/{id}`,
        handler: (request, reply) => {
            clientBuilder.setName(request.payload["name"]);
            clientBuilder.setRedirectUri(request.payload["redirectUri"]);
            clientBuilder.setWebsiteURL(request.payload["websiteURL"]);
            let client = clientBuilder.getResult();

            clientDataMapper.update(request.params["id"], client).then(() => {
                return reply(client);
            }).catch((err) => {
                return reply(err);
            });
        }
    }
};
