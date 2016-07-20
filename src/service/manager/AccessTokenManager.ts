import * as Promise from "promise";
import {ClientId} from "../../model/Client";
import {IAccessTokenDataMapper} from "../dataMapper/index";
import {AccessTokenBuilder} from "../builder/AccessTokenBuilder";
import {AccessToken} from "../../model/AccessToken";
import {UserId} from "../../model/User";

export class AccessTokenManager {
    constructor(
        private accessTokenDataMapper: IAccessTokenDataMapper,
        private accessTokenBuilder: () => AccessTokenBuilder
    ) {
    }

    private create(
        type: string,
        scope:string,
        clientId: ClientId,
        userId: UserId
    ): Promise.IThenable<AccessToken> {
        return new Promise((resolve) => {
            let atb = this.accessTokenBuilder();
            atb.setClientId(clientId);
            atb.setExpiresIn(60 * 60 * 12);
            atb.setType(type);
            atb.setScope(scope);
            atb.setUserId(userId);

            return resolve(atb.getResult());
        });
    }

    createAndInsert(
        type: string,
        scope: string,
        clientId: ClientId,
        userId: UserId
    ): Promise.IThenable<AccessToken> {
        let accessToken: AccessToken;

        return this.create(
            type,
            scope,
            clientId,
            userId
        ).then((token) => {
            accessToken = token;
            return this.accessTokenDataMapper.insert(accessToken);
        }).then((id) => {
            accessToken.id = id;
            return accessToken;
        });
    }
}
