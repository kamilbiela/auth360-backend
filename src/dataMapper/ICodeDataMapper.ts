import {Code} from "../model/Code";
import {ClientId} from "../model/Client";
import {Promise} from "es6-promise";

export interface ICodeDataMapper {
    createAndInsert(clientId: ClientId): Promise<Code>;
    
    // should return Promise<null> when there is no code, or when code expired
    getById(id: string): Promise<Code>;
}
