import * as moment from "moment";
import {AccessToken, AccessTokenId} from "../../model/AccessToken";
import {IUuidGenerator} from "../IUuidGenerator";
import * as Promise from "promise";
import {ClientId} from "../../model";
import {UserId} from "../../model/User";

export class AccessTokenBuilder {
    id: AccessTokenId;
    type: string;
    expiresAt: Date;
    scope: string;
	clientId: ClientId;
	userId: UserId;

    constructor(
        private uuidGenerator: IUuidGenerator
    ) {
    }

    setType(type: string) {
        this.type = type;
    }

    setExpiresIn(seconds: number) {
        this.expiresAt = moment().add(seconds, "seconds").toDate();
    }

    setScope(scope: string) {
        this.scope = scope;
    }

    setClientId(clientId: ClientId) {
        this.clientId = clientId;
    }

    setUserId(userId: UserId) {
        this.userId = userId;
    }

    getResult(): Promise.IThenable<AccessToken> {
        return new Promise((resolve, reject) => {
            if (!this.type || !this.expiresAt || !this.clientId || !this.userId) {
                return reject(new Error("[AccessTokenBuilder] Set required properties"));
            }

            return resolve({
                id: this.uuidGenerator.generate(),
                type: this.type,
                expiresAt: this.expiresAt,
                scope: this.scope,
                clientId: this.clientId,
                userId: this.userId
            });
        });
    }
}
