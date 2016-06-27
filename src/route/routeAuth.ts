import * as Hapi from "hapi";
import * as Joi from "joi";
import * as url from "url";
import * as _ from "lodash";

import {IClientDataMapper} from "../service/dataMapper/IClientDataMapper";
import {IUserDataMapper} from "../service/dataMapper/IUserDataMapper";
import {CodeManager} from "../service/CodeManager";
import {IPasswordHasher} from "../service/IPasswordHasher";
import {Routes} from "../routes.const.ts";

const templateName = "login.html";

// @todo PROPER ERROR HANDLING, SEE 4.1.2
const commonValidationQuery = {
    response_type: Joi.string().equal("code").required(),
    // @todo make client_id validator?
    client_id: Joi.string().required(),

    // @todo this value is optional (4.1.1)
    redirect_uri: Joi.string().uri({
        scheme: "https"
    }).required(),

    scope: Joi.string().optional(),
    state: Joi.string().optional(),
};

// implementation of 4.1.1
export let authGET = (): Hapi.IRouteConfiguration => {
    return {
        method: "GET",
        path: Routes.AuthorizePath, 
        handler: (request, response) => {
            return response.view(templateName);
        },
        config: {
            validate: {
                query: commonValidationQuery,
                failAction(request, response, source, error) {
                    if (_.some(error.data.details, ["path", "response_type"])) {
                        return response.redirect("http://dupa");
                    }
                },
            }
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
            clientDataMapper.getById(request.query.client_id).then((client) => {
                if (_.isEmpty(client)) {
                    console.log("adsda");
                    throw new Error(wrongClientId);
                }
                
                if (request.query.redirect_uri !== client.redirectUri) {
                    console.log("throw 1");
                    throw new Error(wrongRedirectUri);
                }

                return client;
            }).then((client) => {
                return userDataMapper.getByUsername(request.payload.username).then((user) => {
                    if (_.isEmpty(user) || user.id !== request.payload.username) {
                        console.log("throw2");
                        throw new Error(usernameOrPassError);
                    }

                    return passwordHasher.comparePassword(request.payload.password, user.password, user.salt).then((isOk) => {
                        if (!isOk) {
                            throw new Error(usernameOrPassError);
                        }

                        return client;
                    });
                });
            }).then((client) => {
                return codeManager.createAndInsert(client.id).then(code => {
                    return [client, code];
                })
            }).then(([client, code]) => {
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
                    response.view(templateName, {loginOrPasswordError: true});
                } else if (error.message === wrongRedirectUri) {
                    response.view(templateName, {wrongRedirectUriError: true});
                } else if (error.message === wrongClientId) {
                    response.view(templateName, {wrongClientId: wrongClientId});
                } else {
                    response(error);
                }
            })
        },
        config: {
            validate: {
                query: commonValidationQuery,
                payload: {
                    username: Joi.string().required(),
                    password: Joi.string().required()
                },
                failAction(request, response, source, error) {
                    let validation = error.output.payload.validation;
                    if (validation.keys.indexOf("username") || validation.keys.indexOf("password")) {
                        return response.view(templateName, {loginOrPasswordError: true});
                    }
                }
            }
        }
    }  
};
