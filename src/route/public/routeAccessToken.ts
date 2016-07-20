import * as Hapi from "hapi";
import * as moment from "moment";
import * as _ from "lodash";
import {Routes} from "../../routes.const.ts";
import {IClientDataMapper} from "../../service/dataMapper/";
import {AccessTokenManager} from "../../service/manager/AccessTokenManager";
import {AccessTokenTypes} from "../../model/index";
import {ClientId, Client} from "../../model/Client";
import {ICodeDataMapper} from "../../service/dataMapper/ICodeDataMapper";
import {Code} from "../../model/Code";
import {Config} from "../../model/Config";

const CLIENT = "client";
const CODE = "code";

const preClientId = (clientDataMapper: IClientDataMapper) => (request: Hapi.Request, reply: any) => {
    let clientId: ClientId;
    let clientSecret: string;

    let authHeader = request.headers["authorization"];
    if (authHeader.indexOf("Basic ") === 0) {
        let credentials = new Buffer(authHeader.substr(6), "base64").toString("utf-8");
        [clientId, clientSecret] = credentials.split(":");
    }

    if (_.isEmpty(clientId)) {
        let response = reply(JSON.stringify({
            error: "invalid_request",
            error_description: "client_id is empty"
        })).takeover();
        response.statusCode = 400;
        return response;
    }

    clientDataMapper.getById(clientId).then((client) => {
        if (_.isEmpty(client)) {
            let response = reply(JSON.stringify({
                error: "invalid_request",
                error_description: `no client with given client_id (${clientId})`
            })).takeover();
            response.statusCode = 400;
            return response;
        }

        if (client.secret !== clientSecret) {
            /*
               If the
               client attempted to authenticate via the "Authorization"
               request header field, the authorization server MUST
               respond with an HTTP 401 (Unauthorized) status code and
               include the @todo "WWW-Authenticate" response header field
               matching the authentication scheme used by the client
             */
            let response = reply(JSON.stringify({
                error: "invalid_client",
                error_description: "client secret mismatch"
            })).takeover();
            response.statusCode = 401;
            return response;
        }

        return reply(client);
    }, () => {
        // @todo check error and status code
        let response = reply(JSON.stringify({
            error: "invalid_request",
            error_description: "@todo"
        })).takeover();
        response.statusCode = 500;
        return response;
    });
};

const preCode = (codeDataMapper: ICodeDataMapper) => (request: Hapi.Request, reply: any) => {
    codeDataMapper.getById(request.payload["code"]).then(code => {
        if (!code) {
            throw new Error();
        }

        return reply(code);
    }).catch(() => {
        let response = reply(JSON.stringify({
            error: "invalid_grant",
            error_description: "invalid code"
        })).takeover();
        response.statusCode = 401;
        return response;
    });
};

// const preRedirectUri = (codeDataMapper: ICodeDataMapper) => (request: Hapi.Request, reply: any) => {
// };

export let tokenPOST = (
    clientDataMapper: IClientDataMapper,
    accessTokenManager: AccessTokenManager,
    codeDataMapper: ICodeDataMapper
): Hapi.IRouteConfiguration => {
    return {
        method: "POST",
        path: Routes.AccessTokenPath,
        config: {
            pre: [
                {method: preClientId(clientDataMapper), assign: CLIENT},
                {method: preCode(codeDataMapper), assign: CODE}
                // {method: preRedirectUri(), assign: "x"
            ]
        },
        handler: (request, reply) => {
            // redirect_uri is REQUIRED and must match if passed
            // client_id is REQUIREd

            let client: Client = request.pre[CLIENT];
            let code: Code = request.pre[CODE];

            if (request.payload.grant_type === "authorization_code") {
                accessTokenManager.createAndInsert(
                    AccessTokenTypes.BEARER,
                    "scope",
                    client.id,
                    code.userId
                ).then(accessToken =>
                    reply({
                        access_token: accessToken.id,
                        token_type: "bearer",
                        expires_in: moment(accessToken.expiresAt).diff(moment(), "seconds"),
                        refresh_token: "refresh token",
                        scope: accessToken.scope
                    })
                ).catch((error) => {
                    console.log("-00000000000000000000000000000000000000000000000000");
                    console.log(error);
                    reply("@error");
                })
            } else {
                return reply("@todo");
            }
        }
    }
};
