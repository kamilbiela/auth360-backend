import * as Promise from "promise";
import {appInstance} from "./app.spec";
import {Routes} from "../src/routes.const.ts";
import * as _ from "lodash";
import {ServerResponse} from "http";

var rp = require("request-promise");
var assert = require("chai").assert;

let endpoint = "http://localhost:4123";

describe("@acceptance Authorization code flow (3-legged OAuth)", () => {
    describe("4.1.1 Authorization request", () => {
        let code: string = "";
        let redirectUri = "https://redirect.to.localhost";
        let params: any = null;

        beforeEach(() => appInstance.loadClient(redirectUri).then(clientId => {
            params = {
                response_type: "code",
                scope: "uscope1,uscope2",
                state: "some-random-state",
                redirect_uri: redirectUri,
                client_id: clientId
            };
        }));

        describe("GET Authorization request, step A", () => {
            it("should display login form", () => {
                return rp({
                    uri: endpoint + Routes.AuthorizePath,
                    qs: params,
                }).then((data) => {
                    assert.isOk(data.indexOf("<form") !== -1, "Form is present on page");
                });
            });
            
            it("should error on lack of response_type parameter", () => {
                delete params.response_type;
                
                return rp({
                    uri: endpoint + Routes.AuthorizePath,
                    qa: params,
                    resolveWithFullResponse: true,
                }).then((response) => {
                    console.log(response);
                }).catch((data: any) => {
                    console.log(data);
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
});
