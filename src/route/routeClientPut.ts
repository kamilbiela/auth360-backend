import {ClientBuilder} from "../model/ClientBuilder";
import {IClientDataMapper} from "../dataMapper/IClientDataMapper";

export let route = (
    clientBuilder: ClientBuilder,
    clientDataMapper: IClientDataMapper
) => {
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
    


