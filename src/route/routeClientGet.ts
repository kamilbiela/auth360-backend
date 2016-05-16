import {IClientDataMapper} from "../dataMapper/IClientDataMapper";

export let route = (clientDataMapper: IClientDataMapper) => {
    return {
        method: "GET",
        path: `/api/client/{id}`,
        handler: (request, reply) => {
            clientDataMapper.getById(request.params["id"]).then(reply);
        }
    }
};
