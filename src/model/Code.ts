import {ClientId} from "./Client";

export type CodeId = string;

export interface Code {
	id: CodeId; 
	clientId: ClientId;
	// if possible, code should have ttl set on db level
	expiresAt: Date;
	value: string;
}
