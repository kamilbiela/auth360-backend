import {ClientId} from "./Client";

export type CodeId = string;

export class Code {
    id: CodeId;
    // if possible, code should have ttl set on db level
    expiresAt: Date;
    value: string;
    clientId: ClientId;
}
