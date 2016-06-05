import {User, UserId} from "../../model/User";
import {IRedisClient} from "../../service/IRedisClient";
import {IUserDataMapper} from "../../service/dataMapper/IUserDataMapper";
import {BaseDataMapperRedis} from "./BaseDataMapperRedis";

export class UserDataMapperRedis extends BaseDataMapperRedis<User, UserId> implements IUserDataMapper {
    protected objectName = "user";
    
    public getByUsername(user: string): Promise.IThenable<User> {
        return this.getById(user);
    }
    
    public hasUsername(username: UserId): Promise.IThenable<boolean> {
        return this.hasId(username);
    }
}
