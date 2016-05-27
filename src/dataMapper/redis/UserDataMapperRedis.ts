import {User, UserId} from "../../model/User";
import {IRedisClient} from "../../service/IRedisClient";
import {IUserDataMapper} from "../../service/dataMapper/IUserDataMapper";
import {BaseDataMapperRedis} from "./BaseDataMapperRedis";

export class UserDataMapperRedis extends BaseDataMapperRedis<User, UserId> implements IUserDataMapper {
    protected objectName = "user";

    constructor(
        redisClient: IRedisClient
    ) {
        super(redisClient);
    }
    
    public getByUsername(user: string): Promise<User> {
        return this.getById(user);
    }
    
    public hasUsername(username: UserId): Promise<boolean> {
        return this.hasId(username);
    }
}
