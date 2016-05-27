import {User, UserId} from "../../model/User";
import {IPasswordHasher} from "../IPasswordHasher";

export class UserBuilder {
    constructor(
        private passwordHasher: IPasswordHasher
    ) {
        
    }

    email: string;
    password: string;
    salt: string;
    
    setEmail(email: string) {
        this.email = email;
    }
    
    setPassword(password: string) {
        this.passwordHasher.generateSalt().then((salt) => {
            this.salt = salt;
        })
    }
    
    getResult(): Promise<User> {
        
    }
}
