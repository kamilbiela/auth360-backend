import {IClientDataMapper} from "../dataMapper/IClientDataMapper";
import {ICodeDataMapper} from "../dataMapper/ICodeDataMapper";
import {IUserDataMapper} from "../dataMapper/IUserDataMapper";

import * as Hapi from "hapi";
import * as Joi from "joi";
import * as url from "url";
import * as _ from "lodash";

let authorizePath = "/authorize";
let templateName = "login.html";

// @todo PROPER ERROR HANDLING, SEE 4.1.2

let commonValidation = {
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
            validate: commonValidation
        }
    }
};

export let authPOST = (
    clientDataMapper: IClientDataMapper,
    codeDataMapper: ICodeDataMapper,
    userDataMapper: IUserDataMapper
): Hapi.IRouteConfiguration => {
    return {
        method: "POST",
        path: authorizePath,
        handler: (request, response) => {
            if (!(request.payload.login && request.payload.password)) {
               	return response.view(templateName, {loginOrPasswordError: true});
            }
            
            userDataMapper.getById(request.payload.login).then((user) => {
                
            });
            
            let redirectUri: string;
            
            this.clientDataMapper.getById(request.query.client_id).then((client) => {
                if (request.query.redirect_uri !== client.redirectUri) {
                   throw new Error("Wrong redirect uri");
                }
                
                redirectUri = client.redirectUri;
                
                return this.codeDataMapper.createAndInsert();
            }).then((code) => {
                // add code to url
                let parsedUrl = url.parse(redirectUri, true);
                parsedUrl.query.code = code;
                
                if (!_.isUndefined(request.query.state)) {
                    parsedUrl.query.state = request.query.state
                }
                
                redirectUri = url.format(parsedUrl);
                
                return response.redirect(redirectUri);
            }).then(null, (err) => {
                return response(err);
            });
        },
        config: {
            validate: commonValidation
        }
    }  
};
