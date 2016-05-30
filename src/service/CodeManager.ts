import {Promise} from "es6-promise";
import {Code} from "../model/Code";
import {ClientId} from "../model/Client";
import {ICodeDataMapper} from "./dataMapper/ICodeDataMapper";
import {CodeBuilder} from "./builder/CodeBuilder";

export class CodeManager {
    constructor(
        private codeDataMapper: ICodeDataMapper,
        private codeBuilder: () => CodeBuilder
    ) {
        
    }
   
    private create(clientId: ClientId): Promise<Code> {
        return new Promise((resolve, reject) => {
            let cb = this.codeBuilder();
            cb.setClientId(clientId);
            cb.setExpiresIn(60 * 10);

            resolve(cb.getResult());
        });
    }
    
    createAndInsert(clientId: ClientId): Promise<any> {
        return this.create(clientId).then((code) => {
            return this.codeDataMapper.insert(code);
        });
    }
}
