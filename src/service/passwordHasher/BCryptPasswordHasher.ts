import {IPasswordHasher} from "../IPasswordHasher";
import * as bcrypt from "bcrypt";
import {Promise} from "es6-promise";

export class BCryptPasswordHasher implements IPasswordHasher {
    constructor() {
    }
    
    generateSalt(): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt((err, salt) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(salt);
            })
        });
    }
    
    generatePasswordHash(password: string, salt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, salt, (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result);
            });
        });
    }
    
    comparePassword(plaintextPassword: string, hashedPassword: string, salt?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plaintextPassword, hashedPassword, (err, isMatch) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(isMatch);
            })
        });
        
    }
}
