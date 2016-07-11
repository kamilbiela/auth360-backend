import {assert} from "chai";
import * as url from "url";

import {appInstance, fixtureData} from "./app.spec";
import {Routes} from "../src/routes.const.ts";
import {Client} from "../src/model/Client";
var rp = require("request-promise");

let authorizeEndpoint = Routes.Endpoint + Routes.AuthorizePath;
let accessTokenEnpoint = Routes.Endpoint + Routes.AccessTokenPath;

describe("@acceptance 4. Authorization code grant:", () => {
    let code:string = "";
    let redirectUri = "https://redirect.to.localhost";
    let params: {response_type: string, scope: string, state: string, redirect_uri: string, client_id: string} = null;
    let client: Client = null;
    
    let makeToken = (clientId, clientSecret) => new Buffer(`${client.id}:${client.secret}`).toString("base64");

    beforeEach(() => appInstance.loadClient(redirectUri).then(c => {
        params = {
            response_type: "code",
            scope: "uscope1,uscope2",
            state: "some-random-state",
            redirect_uri: redirectUri,
            client_id: c.id 
        };
        
        client = c;
    }));
    beforeEach(() => appInstance.loadUser());

    describe("4.1 Authorization Code Grant", () => {
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
               }).then((data) => {
                   assert.fail();
               }, (data) => {
                   let location = data.response.headers.location;
                   
                   assert.equal(data.statusCode, 302);
                   assert.equal(location.indexOf(redirectUri), 0);
                   
                   let parsedUrl = url.parse(location, true);
                   assert.isOk(parsedUrl.query.code);
                   assert.equal(parsedUrl.query.state, params.state);
               });
           }); 
        });
        
        describe("should redirect when", () => {
            [false, true].forEach((withoutStateParam) => {
                let additionalTestDescription = withoutStateParam ? "" : " and state is in redirect response";
                
                it("no response_type parameter is present" + additionalTestDescription, () => {
                    if (withoutStateParam) {
                        delete params.state;
                    }
                    
                    delete params.response_type;
                    
                    return rp({
                        uri: authorizeEndpoint,
                        qs: params,
                        resolveWithFullResponse: true,
                        followRedirect: false,
                    }).then((data) => {
                        console.log(data);
                        assert.fail();
                    }, (data: any) => {
                        let location = data.response.headers.location;
                        assert.equal(data.statusCode, 302);
                        assert.equal(data.response.headers.location.indexOf(redirectUri), 0);
                        
                        let parsedUrl = url.parse(location, true);
                        if (withoutStateParam) {
                            assert.equal(parsedUrl.query.state, params.state);
                        }
                        assert.equal(parsedUrl.query.state, params.state);
                        assert.equal(parsedUrl.query.error, "invalid_request");
                    });
                });
            });
            
        });
        
        describe("should not redirect when redirection uri", () => {
            // when redirect_uri is missing - ignore that fact, since we require that all clients are registered
            // with valid redirect_uri
            it("is mismatching", () => {
                params.redirect_uri += ".mismatch";
                return rp({
                    uri: authorizeEndpoint,
                    qs: params,
                    resolveWithFullResponse: true,
                    followRedirect: false,
                }).then((data) => {
                    console.log(data);
                    assert.fail();
                }, (data) => {
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
                }).then(() => {
                    assert.fail();
                }, (data) => {
                    let body = JSON.parse(data.response.body);
                    assert.equal(body.error, "invalid_request");
                    assert.equal(data.statusCode, 400);
                });
            });
        });
        
        describe("access token request", () => {
            let token = makeToken(client.id, client.secret);
            
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
            }).then((data) => {
                assert.fail();
            }, (data) => 
                url.parse(location, true).query.code
            ).then((code) => 
                rp({
                    uri: accessTokenEnpoint,
                    headers: {
                        Authorization: `Basic ${makeToken(client.id, client.secret)}`
                    },
                    qa: {
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: params.redirect_uri,  // @todo add check for 4.1.3 redirect_uri REQIURED
                        client_id: params.client_id
                    }
                })
            ).then((data) => {
                let body = JSON.parse(data.response.body);
                assert.isOk(body.access_token);
                assert.isOk(body.token_type);
                assert.isNumber(body.expires_in);
                assert.isOk(body.refresh_token);
            });
            
        });
    });
    
    xdescribe("4.4 Client Credentials Grant", () => {
        it("should get access token by POST to /token endpoint", () => {
            let token = makeToken(client.id, client.secret);
            
            return rp({
                uri: accessTokenEnpoint,
                resolveWithFullResponse: true,
                followRedirect: false,
                form: {
                    grant_type: "client_credentials"
                },
                headers: {
                    Authorization: `Bearer ${token}` // @todo check difference
                }
            }).then((data) => {
                let body = JSON.parse(data.response.body);
                assert.isOk(body.access_token);
                assert.isOk(body.token_type);
                assert.isNumber(body.expires_in);
            });
        });
    });
});
