import {assert} from "chai";
import * as url from "url";

import {appInstance, fixtureData} from "./app.spec";
import {Routes} from "../src/routes.const.ts";
var rp = require("request-promise");

let endpoint = "http://localhost:4123";
let authorizeEndpoint = endpoint + Routes.AuthorizePath;

describe("@acceptance Authorization code flow (3-legged OAuth):", () => {
    let code:string = "";
    let redirectUri = "https://redirect.to.localhost";
    let params:any = null;

    beforeEach(() => appInstance.loadClient(redirectUri).then(clientId => {
        params = {
            response_type: "code",
            scope: "uscope1,uscope2",
            state: "some-random-state",
            redirect_uri: redirectUri,
            client_id: clientId
        };
    }));
    beforeEach(() => appInstance.loadUser());
    
    describe("4.1 Authorization", () => {
        
        it("GET should display login form", () => {
            return rp({
                uri: authorizeEndpoint,
                qs: params,
            }).then((data) => {
                // @todo use cheerio and do proper check for form
                assert.isOk(data.indexOf("<form") !== -1, "Form is present on page");
            });
        });
        
        describe("after sending login form with proper username and password", () => {
           it("user-agent should be redirected with supplied state param", () => {
               return rp({
                   uri: authorizeEndpoint,
                   qs: params,
                   method: "POST",
                   followRedirect: false,
                   resolveWithFullResponse: true,
                   form: {
                       username: fixtureData.user.username,
                       password: fixtureData.user.password
                   }
               }).catch((data) => {
                   let location = data.response.headers.location;
                   
                   assert.equal(data.statusCode, 302);
                   assert.equal(location.indexOf(redirectUri), 0);
                   
                   let parsedUrl = url.parse(location, true);
                   assert.isOk(parsedUrl.query.code);
                   assert.equal(parsedUrl.query.state, params.state);
               });
           }); 
        });
        
        /*
         state
         REQUIRED if a "state" parameter was present in the client
         authorization request.  The exact value received from the
         client.
         */
        describe("should redirect when", () => {
            it("no response_type parameter is present", () => {
                delete params.response_type;
                return rp({
                    uri: authorizeEndpoint,
                    qs: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data: any) => {
                    assert.equal(data.statusCode, 302);
                    assert.equal(data.response.headers.location, authorizeEndpoint + "?error=invalid_request");
                });
            });
            
        });
        
        //
        // @todo make this test for GET and POST request
        //
        describe("should not redirect when redirection uri", () => {
            it("is missing", () => {
                delete params.redirect_uri;
                return rp({
                    uri: authorizeEndpoint,
                    qs: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data) => {
                    let body = JSON.parse(data.response.body);
                    assert.equal(body.error, "invalid_request");
                    assert.equal(data.statusCode, 400);
                });
            });
            
            it("is mismatching", () => {
                params.redirect_uri += ".mismatch";
                return rp({
                    uri: authorizeEndpoint,
                    qs: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data: any) => {
                    let body = JSON.parse(data.response.body);
                    assert.equal(body.error, "invalid_request");
                    assert.equal(data.statusCode, 400);
                });
            });
            
            it("is invalid", () => {
                params.redirect_uri += "  /";
                return rp({
                    uri: authorizeEndpoint,
                    qs: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data: any) => {
                    let body = JSON.parse(data.response.body);
                    assert.equal(body.error, "invalid_request");
                    assert.equal(data.statusCode, 400);
                });
            });
        });
        
    });
});
