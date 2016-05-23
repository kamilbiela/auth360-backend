import * as Hapi from "hapi";
import * as Joi from "joi";

// implementation of 4.1.1
export let authGET = (): Hapi.IRouteConfiguration => {
    return {
        method: "GET",
        path: "/authorize", // @todo make it configurable?
        handler: (request, response) => {
            return response.view("login.html");
        },
        config: {
            validate: {
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
            }
        }
    }
} 