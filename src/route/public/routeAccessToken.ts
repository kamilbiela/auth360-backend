import * as Hapi from "hapi";
import {Routes} from "../../routes.const.ts";

export let authCodeGrantGET = (
): Hapi.IRouteConfiguration => {
    return {
        method: "POST",
        path: Routes.AccessTokenPath,
        handler: (request, reply) => {
            let response = reply({
                access_token: "test",
                token_type: "tt",
                expires_in: 3600,
                refresh_token: "refresh token",
                scope: ""
            });
        }
    }
};
