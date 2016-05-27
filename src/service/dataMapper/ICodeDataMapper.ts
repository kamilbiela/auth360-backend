import {Code, CodeId} from "../../model/Code";
import {Promise} from "es6-promise";

export interface ICodeDataMapper {
    insert(code: Code): Promise<CodeId>;
    
    // should return Promise<null> when there is no code, or when code expired
    getById(id: CodeId): Promise<Code>;
}
