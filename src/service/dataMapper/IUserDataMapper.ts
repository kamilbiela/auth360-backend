import {User, UserId} from "../../model/User";
import * as Promise from "promise";

export interface IUserDataMapper {
    insert(user: User): Promise.IThenable<UserId>;
    update(id: UserId, userFieldsToUpdate: {[key: string]: any}): Promise.IThenable<void>;
    hasUsername(id: UserId): Promise.IThenable<boolean>
    getByUsername(id: UserId): Promise.IThenable<User>;
}
