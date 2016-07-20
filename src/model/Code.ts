import {ClientId} from "./Client";
import {UserId} from "./User";

export type CodeId = string;

export interface Code {
	id: CodeId;
	clientId: ClientId;
    userId: UserId;
	// if possible, code should have ttl set on db level
	expiresAt: Date;
	value: string;
}
