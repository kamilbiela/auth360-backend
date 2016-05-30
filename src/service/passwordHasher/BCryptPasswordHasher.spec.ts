import {assert} from "chai";
import {BCryptPasswordHasher} from "./BCryptPasswordHasher";

describe("@unit ClientDataMapperRedis", () => {
    let hasher: BCryptPasswordHasher;
    
    beforeEach(() => {
        hasher = new BCryptPasswordHasher();
    });
    
    it("generateSalt()", () => {
        return hasher.generateSalt().then((salt) => {
            assert.isString(salt);
            assert.isAtLeast(salt.length, 1);
        });
    });
    
    it("generatePasswordHash()", () => {
        let password = "password";
        
        return hasher.generateSalt().then((salt) => {
            return hasher.generatePasswordHash(password, salt)
        }).then((password) => {
			assert.isString(password);
			assert.isAtLeast(password.length, 1);
		});
    });
    
    it("comparePassword(): returns true on valid password", () => {
        let salt = "test";
        let password = "password";

        return hasher.generateSalt().then((salt) => {
            return hasher.generatePasswordHash(password, salt)
        }).then((hashedPassword) => {
            return hasher.comparePassword(password, hashedPassword, salt);
        }).then((isOk) => {
            assert.isTrue(isOk);
        });
    });
    
    it("comparePassword(): returns false on invalid password", () => {
        let salt: string; 
        let password = "password";
        let otherPassword = "otherPassword";

        return hasher.generateSalt().then((salt) => {
            return hasher.generatePasswordHash(password, salt);
        }).then((hashedPassword) => {
            return hasher.comparePassword(otherPassword, hashedPassword, salt);
        }).then((isOk) => {
            assert.isFalse(isOk);
        });
    });
});
