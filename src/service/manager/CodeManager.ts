import * as Promise from "promise";
import {Code} from "../../model/Code";
import {ClientId} from "../../model/Client";
import {ICodeDataMapper} from "../dataMapper/ICodeDataMapper";
import {CodeBuilder} from "../builder/CodeBuilder";
import {UserId} from "../../model/User";

export class CodeManager {
    constructor(
        private codeDataMapper: ICodeDataMapper,
        private codeBuilder: () => CodeBuilder
    ) {

    }

    private create(
        clientId: ClientId,
        userId: UserId
    ): Promise.IThenable<Code> {
        return new Promise((resolve, reject) => {
            let cb = this.codeBuilder();
            cb.setClientId(clientId);
            cb.setExpiresIn(60 * 10);
            cb.setUserId(userId);

            resolve(cb.getResult());
        });
    }

    createAndInsert(
        clientId: ClientId,
        userId: UserId
    ): Promise.IThenable<any> {
        return this.create(clientId, userId).then((code) => {
            return this.codeDataMapper.insert(code);
        });
    }
}
