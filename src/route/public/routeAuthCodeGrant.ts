import * as Hapi from "hapi";
import * as Joi from "joi";
import * as url from "url";
import * as _ from "lodash";

import {IClientDataMapper} from "../../service/dataMapper/IClientDataMapper";
import {IUserDataMapper} from "../../service/dataMapper/IUserDataMapper";
import {CodeManager} from "../../service/manager/CodeManager";
import {IPasswordHasher} from "../../service/IPasswordHasher";
import {Routes} from "../../routes.const.ts";
import {Client} from "../../model/Client";
import {User} from "../../model/User";

const TEMPLATE_NAME = "login.html";

const CLIENT = "client";
const REDIRECT_URI = "redirect_uri";
const RESPONSE_TYPE = "response_type";

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

const preRedirectUri = () => (request: Hapi.Request, reply: any): any => {
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

    return reply();
};

const preResponseType = () => (request: Hapi.Request, reply: any): any => {
    let responseType = request.query.response_type;
    let client: Client = request.pre[CLIENT];

    if (_.isEmpty(responseType)) {
        let params = ["error=invalid_request"];
        if (request.query.state) {
            params.push("state=" + request.query.state);
        }
        return reply().redirect(client.redirectUri + (params.length ? "?" + params.join("&") : "")).takeover();
    }

    return reply();
};


export let authCodeGrantGET = (
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
                {method: preRedirectUri(), assign: REDIRECT_URI},
                {method: preResponseType(), assign: RESPONSE_TYPE}
            ]
        },
    }
};

/*
@todo clean this after tests
 */
export let authCodeGrantPOST = (
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
            let currentUser: User;

            return userDataMapper.getByUsername(request.payload.username).then((user) => {
                if (_.isEmpty(user) || user.id !== request.payload.username) {
                    throw new Error(usernameOrPassError);
                }

                currentUser = user;

                return passwordHasher.comparePassword(request.payload.password, user.password, user.salt).then((isOk) => {
                    if (!isOk) {
                        throw new Error(usernameOrPassError);
                    }
                });
            }).then(() => {
                return codeManager.createAndInsert(client.id, currentUser.id).then(code => {
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
