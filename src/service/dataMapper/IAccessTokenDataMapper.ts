import {AccessToken, AccessTokenId} from "../../model/AccessToken";
import * as Promise from "promise";

export interface IAccessTokenDataMapper {
	insert(accessToken: AccessToken): Promise.IThenable<AccessTokenId>;
	// hasId(id: AccessTokenId): Promise.IThenable<boolean>;
	getById(id: AccessTokenId): Promise.IThenable<AccessToken>;
}
