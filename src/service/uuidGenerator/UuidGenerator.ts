import {IUuidGenerator} from "../IUuidGenerator";
import * as nodeUuid from "node-uuid";

export class UuidGenerator implements IUuidGenerator {
    generate(): string {
        return (<any>nodeUuid).v4();
    }
}
