import {assert} from "chai";
import * as redis from "redis";
import * as _ from "lodash";
import {Client, ClientTypeEnum} from "../../model/Client";
import {ClientDataMapperRedis} from "./ClientDataMapperRedis";

// @todo change to BaseDataMapperRedis test
describe("@functional @redis ClientDataMapperRedis", () => {
    let redisClient = redis.createClient();
    let clientDataMapperRedis = new ClientDataMapperRedis(redisClient);

    let client: Client;
    
    beforeEach((done) => {
        client = {
            id: "test:id123",
            secret: "secret123",
            name: "name123" + Math.random(),
            websiteUrl: "http://localhost",
            redirectUri: "http://redirectUri",
            type: ClientTypeEnum.PUBLIC
        };
        
        redisClient.flushdb((err) => {
            if (err) {
                throw err;
            }

            done();
        })
    });
    
    describe("insert", () => {
        it("should insert client to redis", () => {
            return clientDataMapperRedis.insert(client).then(() => {
                return new Promise((resolve) => {
                    redisClient.get(`client:${client.id}`, (err, result) => {
                        assert.ifError(err);
                        let c: Client = JSON.parse(result);
                        assert.equal(c.name, client.name);
                        resolve(null);
                    });
                });
            })
        });
        
        it("should not insert client after one is already in db", () => {
            return clientDataMapperRedis.insert(client).then(() => {
                let clientCopy = _.clone(client);
                clientCopy.name = "new_name";
                return clientDataMapperRedis.insert(client).then(() => {
                    return new Promise((resolve) => {
                        redisClient.get(`client:${client.id}`, (err, result) => {
                            assert.ifError(err);
                            let c:Client = JSON.parse(result);
                            assert.equal(c.name, client.name);
                            resolve(null);
                        });
                    });
                })
            })
        });
    });

    describe("update", () => {
        it("should update value in redis", () => {
            let newName = "updated_name";
            return clientDataMapperRedis.insert(client).then(() => {
                return clientDataMapperRedis.update(client.id, {name: newName});
            }).then(() => {
                return new Promise((resolve) => {
                    redisClient.get(`client:${client.id}`, (err, result) => {
                        assert.ifError(err);

                        let c: Client = JSON.parse(result);
                        assert.equal(c.name, newName);
                        resolve(null);
                    })
                })
            })
        })
    });

    describe("hasId", () => {
        it("should return true if value is in redis", () => {
            return clientDataMapperRedis.insert(client).then(() => {
                return clientDataMapperRedis.hasId(client.id);
            }).then((hasId) => {
                assert.strictEqual(hasId, true);
            }, assert.ifError);
        });
        
        it("should return false if value is not in redis", () => {
            return clientDataMapperRedis.hasId(client.id).then((hasId) => {
                assert.strictEqual(hasId, false);
            }, assert.ifError);
        });
    });

    describe("getById", () => {
        it("should return client object when it's in db", () => {
            return clientDataMapperRedis.insert(client).then(() => {
                return clientDataMapperRedis.getById(client.id);
            }).then((clientFromDb) => {
                assert.deepEqual(clientFromDb, client);
            })
        });

        it("should null when object is not in db", () => {
            return clientDataMapperRedis.getById(client.id).then((result) => {
                assert.strictEqual(result, null);
            })
        })
    });
});
