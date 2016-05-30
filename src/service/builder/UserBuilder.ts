import {User, UserId} from "../../model/User";
import {IPasswordHasher} from "../IPasswordHasher";
import {Promise} from "es6-promise";

import * as _ from "lodash";
import {IUuidGenerator} from "../IUuidGenerator";

export class UserBuilder {
    constructor(
        private uuidGenerator: IUuidGenerator,
        private passwordHasher: IPasswordHasher
    ) {
    }

    email: string;
    password: string;
    salt: string;
    
    saltPromise: Promise<string>;
    
    setEmail(email: string) {
        this.email = email;
    }
    
    setPassword(password: string) {
        this.passwordHasher.generateSalt().then((salt) => {
            this.salt = salt;
            return this.passwordHasher.generatePasswordHash(password, salt);
        });
    }
    
    getResult(): Promise<User> {
        if (_.isUndefined(this.saltPromise)) {
            throw new Error("You need to set password first");
        }
        
        return this.saltPromise.then(() => {
            return {
                id: this.uuidGenerator.generate(),
                email: this.email,
                password: this.password,
                salt: this.salt
            }
        });
    }
}
