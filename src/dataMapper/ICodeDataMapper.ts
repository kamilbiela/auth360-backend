import {Code} from "../model/Code";
import {Promise} from "es6-promise";

export interface ICodeDataMapper {
    insert(code: Code): Promise<void>;
    
    // should return Promise<null> when there is no code, or when code expired
    getById(id: string): Promise<Code>;
}