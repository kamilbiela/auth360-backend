import {Promise} from "es6-promise";
import {Code} from "../model/Code";
import {ClientId} from "../model/Client";
import {ICodeDataMapper} from "./dataMapper/ICodeDataMapper";

export class CodeManager {
    constructor(
        private codeDataMapper: ICodeDataMapper,
        private codeBuilder: CodeBuilde
    ) {
        
    }
    
    createAndInsert(clientId: ClientId): Promise<Code> {
        return new Promise((resolve, reject) => {
            
        });
    }
}
