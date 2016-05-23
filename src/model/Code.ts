import {ClientId} from "./Client";

export type CodeId = string;

export class Code {
    id: CodeId;
    expiresAt: Date;
    value: string;
    clientId: ClientId;
}