import {User, UserId} from "../../model/User";
import {IRedisClient} from "../../service/IRedisClient";
import {IUserDataMapper} from "../IUserDataMapper";
import {BaseDataMapperRedis} from "./BaseDataMapperRedis";

export class UserDataMapperRedis extends BaseDataMapperRedis<User, UserId> implements IUserDataMapper {
    protected objectName = "user";

    constructor(
        redisClient: IRedisClient
    ) {
        super(redisClient);
    }
}
