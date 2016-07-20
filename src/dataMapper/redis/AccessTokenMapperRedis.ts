import {AccessToken, AccessTokenId} from "../../model/AccessToken";
import {IAccessTokenDataMapper} from "../../service/dataMapper/IAccessTokenDataMapper";
import {BaseDataMapperRedis} from "./BaseDataMapperRedis";

export class AccessTokenDataMapperRedis extends BaseDataMapperRedis<AccessToken, AccessTokenId> implements IAccessTokenDataMapper {
    protected objectName = "access_token";
}
