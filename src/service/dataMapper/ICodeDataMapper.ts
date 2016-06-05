import {Code, CodeId} from "../../model/Code";
import * as Promise from "promise";

export interface ICodeDataMapper {
    insert(code: Code): Promise.IThenable<CodeId>;
    
    // should return Promise<null> when there is no code, or when code expired
    getById(id: CodeId): Promise.IThenable<Code>;
}
