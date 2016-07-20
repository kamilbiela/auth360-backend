import * as moment from "moment";
import {ClientId} from "../../model/Client";
import {Code} from "../../model/Code";
import {IUuidGenerator} from "../IUuidGenerator";
import * as Promise from "promise";
import {UserId} from "../../model/User";

export class CodeBuilder {
    clientId: ClientId;
    expiresAt: Date;
    userId: UserId;

    constructor(
        private uuidGenerator: IUuidGenerator
    ) {
    }

    setExpiresIn(seconds: number) {
        this.expiresAt = moment().add(seconds, "seconds").toDate();
    }

    setClientId(id: ClientId) {
        this.clientId = id;
    }

    setUserId(id: UserId) {
        this.userId = id;
    }

    getResult(): Promise.IThenable<Code> {
        return new Promise((resolve) => {
            return resolve({
                id: this.uuidGenerator.generate(),
                clientId: this.clientId,
                expiresAt: this.expiresAt,
                userId: this.userId
            });
        });
    }
}
