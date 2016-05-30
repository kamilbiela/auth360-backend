import * as _ from "lodash";
import {IRedisClient} from "../../service/IRedisClient";
import {Promise} from "es6-promise";
import {IUuidGenerator} from "../../service/IUuidGenerator";

interface ObjectAttributes {
    id: any
}

export class BaseDataMapperRedis<T extends ObjectAttributes, TId> {
    protected objectName: string = null;
    protected stringifyFunc: any = null; // @todo proper function type declaration

    constructor(
        protected redisClient: IRedisClient = null,
        protected uuidGenerator: IUuidGenerator
    ) {
    }

    private getKeyForId(id: TId): string {
        if (_.isEmpty(this.objectName)) {
            throw new Error("this.objectName is empty. Fix code.");
        }

        return `${this.objectName}:${id}`;
    }

    private stringify(data: T) {
        if (_.isFunction(this.stringifyFunc)) {
            return JSON.stringify(data, this.stringifyFunc)
        }

        return JSON.stringify(data);
    }

    insert(obj: T): Promise<TId> {
        return new Promise<TId>((resolve, reject) => {
            this.redisClient.setnx(this.getKeyForId(obj.id), this.stringify(obj), (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve(obj.id);
            });
        });
    }

    update(id: TId, fieldsToUpdate: Object): Promise<void> {
        return this.getById(id).then((objFromDb) => {
            return new Promise<void>((resolve, reject) => {
                let newObj = _.merge(objFromDb, fieldsToUpdate);
                this.redisClient.set(this.getKeyForId(objFromDb.id), this.stringify(newObj), (err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve();
                });
            });
        });
    }

    hasId(id: TId): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.redisClient.exists(this.getKeyForId(id), (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(!!result);
            })
        });
    }

    getById(id: TId): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.redisClient.get(this.getKeyForId(id), (err, data) => {
                if (err) {
                    return reject(err);
                }

                return resolve(JSON.parse(data));
            });
        });
    }
}
