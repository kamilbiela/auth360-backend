import {Promise} from "es6-promise";
import {Code} from "../../model/Code";
import {ClientId} from "../../model/Client";
import {IRedisClient} from "../../service/IRedisClient";
import {ICodeDataMapper} from "../ICodeDataMapper";
import {IUuidGenerator} from "../../service/IUuidGenerator";

import * as _ from "lodash";
import * as moment from "moment";

export class CodeDataMapperRedis implements ICodeDataMapper {
    constructor(
        private redisClient: IRedisClient,
        private uuidGenerator: IUuidGenerator
    ) {
    }
    
    private getKeyForId(id: string): string {
        return `code:${id}`;
    }

    createAndInsert(clientId: ClientId): Promise<Code> {
        return new Promise<Code>((resolve, reject) => {
            let seconds = 10 * 60; // @todo make it configurable
            let code = new Code(
                this.uuidGenerator.generate(),
                moment().add(seconds, "seconds").toDate(),
                this.uuidGenerator.generate(),
                clientId
            );
            this.redisClient.setex(this.getKeyForId(code.id), seconds, JSON.stringify(code), (err) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(code);
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
