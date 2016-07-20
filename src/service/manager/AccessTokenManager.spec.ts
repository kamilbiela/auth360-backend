/*
import * as sinon from "sinon";
import {AccessTokenManager} from "./AccessTokenManager";
import {IAccessTokenDataMapper} from "../dataMapper/IAccessTokenDataMapper";
import {AccessTokenBuilder} from "../builder/AccessTokenBuilder";

describe("AccessTokenManager", () => {
    let accessTokenDataMapper: IAccessTokenDataMapper
    let accessTokenBuilderInstance;
    let accessTokenBuilder: () => AccessTokenBuilder;
    let accessTokenManager: AccessTokenManager;

    beforeEach(() => {
        accessTokenDataMapper = <IAccessTokenDataMapper>{};
        accessTokenBuilder = () => accessTokenBuilderInstance;
        accessTokenManager = new AccessTokenManager(accessTokenDataMapper, accessTokenBuilder);
    });

    describe("createAndInsert", () => {
        it("should insert token to the mapper from builder", (done) => {
            accessTokenBuilderInstance = sinon.createStubInstance(AccessTokenBuilder);
            accessTokenManager
                .createAndInsert("type", "scope", "clientId", "userId")
                .then(done);
        });
    });
});
*/
