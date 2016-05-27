import * as Promise from "es6-promise";
import {ClientId, Code} from "../model";

export interface ICodeGenerator {
	generate(clientId: ClientId): Promise<Code>
}
