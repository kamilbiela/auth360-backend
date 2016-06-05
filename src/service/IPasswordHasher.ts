import * as Promise from "promise";

export interface IPasswordHasher {
    generateSalt(): Promise.IThenable<string>;
    generatePasswordHash(password: string, salt: string): Promise.IThenable<string>;
    comparePassword(plaintextPassword: string, hashedPassword: string, salt: string): Promise.IThenable<boolean>;
}
