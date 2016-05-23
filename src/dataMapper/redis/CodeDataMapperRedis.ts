import {Promise} from "es6-promise";
import {Code} from "../../model/Code";
import {IRedisClient} from "../../service/IRedisClient";
import {ICodeDataMapper} from "../ICodeDataMapper";
import * as _ from "lodash";

export class CodeDataMapperRedis implements ICodeDataMapper {
    constructor(
        private redisClient: IRedisClient
    ) {
    }
    
    private getKeyForId(id: string): string {
        return `code:${id}`;
    }

    insert(code: Code): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.redisClient.setnx(this.getKeyForId(code.id), JSON.stringify(code), (err) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(code.id);
            });
        });
    }
    
    getById(id: string): Promise<Code> {
        return new Promise<Code>((resolve, reject) => {
            this.redisClient.get(this.getKeyForId(id), (err, data) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(JSON.parse(data));
            });
        });
    }
}
