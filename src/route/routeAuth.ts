import * as Hapi from "hapi";
import * as Joi from "joi";

let authorizePath = "/authorize";
let templateName = "login.html";

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

export let authPOST = (): Hapi.IRouteConfiguration => {
    return {
        method: "POST",
        path: authorizePath,
        handler: (request, response) => {
            if (!(request.payload.login && request.payload.password)) {
               	return response.view(templateName, {loginOrPasswordError: true});
            }
        },
        config: {
            validate: commonValidation
        }
    }  
};
