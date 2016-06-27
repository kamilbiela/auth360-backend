import {assert} from "chai";
import * as url from "url";

import {appInstance} from "./app.spec";
import {Routes} from "../src/routes.const.ts";
var rp = require("request-promise");

let endpoint = "http://localhost:4123";

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
    
    describe("4.1.1 Authorization request", () => {
        it("should display login form", () => {
            return rp({
                uri: endpoint + Routes.AuthorizePath,
                qs: params,
            }).then((data) => {
                assert.isOk(data.indexOf("<form") !== -1, "Form is present on page");
            });
        });
    });
    
    describe("4.1.2 Authorization response", () => {
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
                    uri: endpoint + Routes.AuthorizePath,
                    qa: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data: any) => {
                    assert.equal(data.statusCode, 302);
                    assert.equal(data.response.headers.location, "http://dupa");
                });
            });
            
            xit("invalid_request", () => {});
            xit("unauthorized_client", () => {});
            xit("access_denied", () => {});
            xit("unsupported_response_type", () => {});
            xit("invalid_scope", () => {});
            xit("server_error", () => {});
            xit("temporarily_unavailable", () => {});
        });
        
        //
        // @todo check what http status code it should be
        //
        describe("should not redirect when redirection uri", () => {
            it("is missing", () => {
                delete params.redirect_uri;
                return rp({
                    uri: endpoint + Routes.AuthorizePath,
                    qa: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data: any) => {
                    assert.equal(data.statusCode, 500);
                    // @todo check if error message is on page
                });
            });
            it("is mismatching", () => {
                params.redirect_uri += ".mismatch";
                return rp({
                    uri: endpoint + Routes.AuthorizePath,
                    qa: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data: any) => {
                    assert.equal(data.statusCode, 500);
                    // @todo check if error message is on page
                });
            });
            it("is invalid", () => {
                params.redirect_uri += "  /";
                return rp({
                    uri: endpoint + Routes.AuthorizePath,
                    qa: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).catch((data: any) => {
                    assert.equal(data.statusCode, 500);
                    // @todo check if error message is on page
                });
            });
        });
    });
    
    xit("Get authorization code", () => {
        return rp({
            uri: endpoint + Routes.AuthorizePath,
            qs: params,
        });
        // return ).then(data => {
        //     assert.isOk(data.indexOf("<form") !== -1, "Form is present on page");
        //
        //     return rp({
        //         uri: endpoint + Routes.AuthorizePath,
        //         form: {
        //             username: data.user.username,
        //             password: data.user.password
        //         }
        //
        // });
    });
});
