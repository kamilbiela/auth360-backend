import * as Promise from "es6-promise";

export interface IPasswordHasher {
    generateSalt(): Promise<string>;
    generatePasswordHash(password: string, salt: string);
    comparePassword(plaintextPassword: string, hashedPassword: string, salt?: string);
}