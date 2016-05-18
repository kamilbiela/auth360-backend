import {Promise} from "es6-promise";
import {Client} from "../../model/Client";
import {IRedisClient} from "../../service/IRedisClient";
import {IClientDataMapper} from "../IClientDataMapper";
import * as _ from "lodash";

export class ClientDataMapperRedis implements IClientDataMapper {
    constructor(
        private redisClient: IRedisClient
    ) {
    }
    
    private getKeyForId(id: string): string {
        return `client:${id}`;
    }

    insert(client: Client): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.redisClient.setnx(this.getKeyForId(client.id), JSON.stringify(client), (err) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(client.id);
            });
        });
    }
    
    update(id: string, clientFieldsToUpdate: Object): Promise<void> {
        return this.getById(id).then((client) => {
            return new Promise<void>((resolve, reject) => {
                let newClient = _.merge(client, clientFieldsToUpdate);
                this.redisClient.set(this.getKeyForId(client.id), JSON.stringify(newClient), (err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve();
                });
            });
        });
    }

    hasId(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.redisClient.exists(this.getKeyForId(id), (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(!!result);
            })
        });
    }
    
    getById(id: string): Promise<Client> {
        return new Promise<Client>((resolve, reject) => {
            this.redisClient.get(this.getKeyForId(id), (err, data) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(JSON.parse(data));
            });
        });
    }
}
