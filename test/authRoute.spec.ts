var assert = require("chai").assert;

import {startApp} from "./app.spec";

describe("@acceptance Authorization code flow (3-legged OAuth)", () => {
    describe("First time authorization code flow", () => {
        let code: string = "";

        it("Get authorization code", () => {
            let params = {
                response_type: "code",
                scope: "uscope1,uscope2",
                state: "some-random-state",
                redirect_uri: "https://redirect.to.localhost"
            };

            // do the request

            // fill in login form

            // send form

            // response should be

            // https://redirect.to.localhost/?code=RANDOM_CODE&state=some-random-state
        });
        
        it("Get token", () => {
            // POST /token
            // HEader:
            //      - authorization: Basic base64(ClientID:ClientSecret)
            
            // response:
            /*
            {
                access_token: wqeqweqw
                token_type: "Bearer"
                refresh_token: asdasdas
                expires_in: 3600
                
            }
             */
        });
        
        it("Access protected resource", () => {
            
        });
    });

    describe("Follow-up Authorization code flow (expired access_token, valid refresh_token)", () => {
       it("Token endpoint", () => {

       })
    });
});