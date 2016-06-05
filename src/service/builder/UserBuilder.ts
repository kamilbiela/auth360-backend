import {User, UserId} from "../../model/User";
import {IPasswordHasher} from "../IPasswordHasher";
import * as Promise from "promise";

import * as _ from "lodash";
import {IUuidGenerator} from "../IUuidGenerator";

export class UserBuilder {
    constructor(
        private uuidGenerator: IUuidGenerator,
        private passwordHasher: IPasswordHasher
    ) {
    }

    email: string;
    salt: string;
    passwordPromise: Promise.IThenable<string>;
    
    setEmail(email: string) {
        this.email = email;
    }
    
    setPassword(password: string): Promise.IThenable<string> {
        this.passwordPromise = this.passwordHasher.generateSalt().then((salt) => {
            this.salt = salt;
            return this.passwordHasher.generatePasswordHash(password, salt);
        });
        
        return this.passwordPromise;
    }
    
    getResult(): Promise.IThenable<User> {
        if (_.isUndefined(this.passwordPromise)) {
            throw new Error("You need to set password first");
        }
       
        return Promise.all([
            this.passwordPromise,
        ]).then(([password]) => {
            return {
                id: this.email,
                email: this.email,
                password: password,
                salt: this.salt
            }
        });
    }
}
