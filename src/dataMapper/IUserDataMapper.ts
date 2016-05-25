import {User, UserId} from "../model/User";
import {Promise} from "es6-promise";

export interface ICodeDataMapper {
    insert(user: User): Promise<UserId>;
    update(id: UserId, userFieldsToUpdate: {[key: string]: any}): Promise<void>;
    hasId(id: UserId): Promise<boolean>;
    getById(id: UserId): Promise<User>;
}
