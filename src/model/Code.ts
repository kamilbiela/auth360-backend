import {ClientId} from "./Client";

export type CodeId = string;

export class Code {
    constructor(
        public id: CodeId,
        // if possible, code should have ttl set on db level
        public expiresAt: Date,
        public value: string,
        public clientId: ClientId
    ) {
    }
}
