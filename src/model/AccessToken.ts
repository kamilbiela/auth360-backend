import {ClientId} from "./Client";
import {UserId} from "./User";
export type AccessTokenId = string;

// list of supported token types
export const AccessTokenTypes = {
    BEARER: "bearer"
};

export interface AccessToken {
    id: AccessTokenId;
    clientId: ClientId;
    userId: UserId;
    type: string;
    expiresAt: Date;
    scope: string;
}
