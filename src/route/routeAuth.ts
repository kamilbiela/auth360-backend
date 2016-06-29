import * as Hapi from "hapi";
import * as Joi from "joi";
import * as url from "url";
import * as _ from "lodash";

import {IClientDataMapper} from "../service/dataMapper/IClientDataMapper";
import {IUserDataMapper} from "../service/dataMapper/IUserDataMapper";
import {CodeManager} from "../service/CodeManager";
import {IPasswordHasher} from "../service/IPasswordHasher";
import {Routes} from "../routes.const.ts";
import {Client} from "../model/Client";

const TEMPLATE_NAME = "login.html";
const CLIENT = "client";
const REDIRECT_URI = "redirect_uri";

const preClientId = (clientDataMapper: IClientDataMapper) => (request: Hapi.Request, reply: any) => {
    let clientId = request.query.client_id;
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

        return reply(client);
    });
};

const preRedirectUri = () =>
    (request: Hapi.Request, reply: any): any => {
        let client: Client = request.pre[CLIENT];
        let redirectUri = request.query.redirect_uri;
        if (!_.isEmpty(redirectUri) && redirectUri !== client.redirectUri) {
            let response = reply(JSON.stringify({
                error: "invalid_request",
                error_description: "redirect_uri mismatch"
            })).takeover();
            response.statusCode = 400;
            return response;
        }
        
        return reply(true);
    };

    
export let authGET = (
    clientDataMapper: IClientDataMapper
): Hapi.IRouteConfiguration => {
    return {
        method: "GET",
        path: Routes.AuthorizePath, 
        handler: (request, response) => {
            return response.view(TEMPLATE_NAME);
        },
        config: {
            pre: [
                {method: preClientId(clientDataMapper), assign: CLIENT},
                {method: preRedirectUri(), assign: REDIRECT_URI}
            ]
        },
    }
};

/* 
@todo clean this after tests
 */
export let authPOST = (
    clientDataMapper: IClientDataMapper,
    codeManager: CodeManager,
    userDataMapper: IUserDataMapper,
    passwordHasher: IPasswordHasher
): Hapi.IRouteConfiguration => {
    const usernameOrPassError = "usernameOrPassError";
    const wrongRedirectUri = "wrongRedirectUri";
    const wrongClientId = "wrongClientId";

    return {
        method: "POST",
        path: Routes.AuthorizePath, 
        handler: (request, response) => {
            let client: Client = request.pre[CLIENT];
            
            return userDataMapper.getByUsername(request.payload.username).then((user) => {
                if (_.isEmpty(user) || user.id !== request.payload.username) {
                    throw new Error(usernameOrPassError);
                }

                return passwordHasher.comparePassword(request.payload.password, user.password, user.salt).then((isOk) => {
                    if (!isOk) {
                        throw new Error(usernameOrPassError);
                    }
                });
            }).then(() => {
                return codeManager.createAndInsert(client.id).then(code => {
                    return code;
                })
            }).then((code) => {
                let parsedUrl = url.parse(client.redirectUri, true);
                parsedUrl.query.code = code;

                if (!_.isUndefined(request.query.state)) {
                    parsedUrl.query.state = request.query.state;
                }

                return url.format(parsedUrl);
            }).then((redirectUri) => {
                response.redirect(redirectUri);
            }, (error: Error) => {
                if (error.message === usernameOrPassError) {
                    response.view(TEMPLATE_NAME, {loginOrPasswordError: true});
                } else if (error.message === wrongRedirectUri) {
                    response.view(TEMPLATE_NAME, {wrongRedirectUriError: true});
                } else if (error.message === wrongClientId) {
                    response.view(TEMPLATE_NAME, {wrongClientId: wrongClientId});
                } else {
                    response(error);
                }
            })
        },
        config: {
            pre: [
                {method: preClientId(clientDataMapper), assign: CLIENT},
                {method: preRedirectUri(), assign: REDIRECT_URI}
            ]
        }
    }  
};
