import {IRoute} from "./IRoute";
import {ClientBuilder} from "../model/ClientBuilder";
import {IClientDataMapper} from "../dataMapper/IClientDataMapper";

export let route: IRoute = (
    clientBuilder: ClientBuilder,
    clientDataMapper: IClientDataMapper
) => {
    return {
        method: "POST",
        path: `/api/client/{id}`,
        handler: (request, reply) => {
            clientBuilder.setName(request.payload["name"]);
            clientBuilder.setRedirectUri(request.payload["redirectUri"]);
            clientBuilder.setWebsiteURL(request.payload["websiteURL"]);
            let client = clientBuilder.getResult();

            clientDataMapper.insertOrUpdateClient(client).then(() => {
                return reply(client);
            }).catch((err) => {
                return reply(err);
            });
        }
    }
};
    


