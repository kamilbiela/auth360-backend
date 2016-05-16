import {Promise} from "es6-promise";
import {Client} from "../../model/Client";
import {IRedisClient} from "../../service/IRedisClient";
import {IClientDataMapper} from "../IClientDataMapper";

export class ClientDataMapperRedis {
    constructor(
        private redisClient: IRedisClient
    ) {
    }

    insert(client: Client): Promise<string> {
        
    }
    
    update(clientFieldsToUpdate: Client): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.redisClient.set(client.id, JSON.stringify(client), (err) => {
                if (err) {
                    return reject(err);
                }

                return;
            });
        })
    }

    hasId(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.redisClient.exists(id, (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(!!result);
            })
        });
    }
    
    getById(id: string): Promise<Client> {
        return new Promise<Client>((resolve, reject) => {
            this.redisClient.get(id, (err, data) => {
                if (err) {
                    return reject(err);
                }
                
                return resolve(JSON.parse(data));
            });
        });
    }
}
