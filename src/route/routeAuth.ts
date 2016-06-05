import * as Hapi from "hapi";
import * as Joi from "joi";
import * as url from "url";
import * as _ from "lodash";

import {IClientDataMapper} from "../service/dataMapper/IClientDataMapper";
import {ICodeDataMapper} from "../service/dataMapper/ICodeDataMapper";
import {IUserDataMapper} from "../service/dataMapper/IUserDataMapper";
import {CodeManager} from "../service/CodeManager";
import {IPasswordHasher} from "../service/IPasswordHasher";
import {ClientId, Client} from "../model/client";

let authorizePath = "/authorize";
let templateName = "login.html";

// @todo PROPER ERROR HANDLING, SEE 4.1.2
let commonValidationQuery = {
    query: {
        response_type: Joi.string().equal("code").required(),
        // @todo make client_id validator?
        client_id: Joi.string().required(),

        // @todo this value is optional (4.1.1)
        redirect_uri: Joi.string().uri({
            scheme: "https"
        }).required(),

        scope: Joi.string().optional(),
        state: Joi.string().optional()
    }
};
    
// implementation of 4.1.1
export let authGET = (): Hapi.IRouteConfiguration => {
    return {
        method: "GET",
        path: authorizePath, 
        handler: (request, response) => {
            return response.view(templateName);
        },
        config: {
            validate: {
                query: commonValidationQuery
            } 
        }
    }
};

export let authPOST = (
    clientDataMapper: IClientDataMapper,
    codeManager: CodeManager,
    userDataMapper: IUserDataMapper,
    passwordHasher: IPasswordHasher
): Hapi.IRouteConfiguration => {
    return {
        method: "POST",
        path: authorizePath,
        handler: (request, response) => {
            if (!(request.payload.login && request.payload.password)) {
                return response.view(templateName, {loginOrPasswordError: true});
            }
           
            const usernameOrPassError = "usernameOrPassError";
            const wrongRedirectUri = "wrongRedirectUri";
            const wrongClientId = "wrongClientId";

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
                return userDataMapper.getByUsername(request.payload.login).then((user) => {
                    if (_.isEmpty(user) || user.id !== request.payload.login) {
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
            }, (err: Error) => {
                if (err.message === usernameOrPassError) {
                    response.view(templateName, {loginOrPasswordError: true});
                } else if (err.message === wrongRedirectUri) {
                    response.view(templateName, {wrongRedirectUriError: true});
                } else if (err.message === wrongClientId) {
                    response.view(templateName, {wrongClientId: wrongClientId});
                } else {
                    console.log("----------------- ");
                    console.error(err);
                }
                
            })
        },
        config: {
            validate: {
                query: Object.assign({}, commonValidationQuery, {
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            }
        }
    }  
};
