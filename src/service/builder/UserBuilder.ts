import {User, UserId} from "../../model/User";

export class UserBuilder {
    constructor(
        private passwordHasher: any
    ) {
        
    }

    id: UserId;
    email: string;
    password: string;
    salt: string;
    
    setId(id: UserId) {
        this.id = id;
    }
    
    setEmail(email: string) {
        
    }
    
    setPassword(password: string) {
        
    }
    
    getResult(): User {
        
    }
}
