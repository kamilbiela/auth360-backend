import * as Promise from "promise";
import {ClientId, Code} from "../model";

export interface ICodeGenerator {
	generate(clientId: ClientId): Promise.IThenable<Code>
}
