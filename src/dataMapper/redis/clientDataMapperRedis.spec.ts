import {assert} from "chai";
import {Client, ClientTypeEnum} from "../../model/client";

import * as redis from "redis";
import {ClientDataMapperRedis} from "./clientDataMapper";

describe("ClientDataMapperRedis @functional @redis", () => {
	let redisClient = redis.createClient({
		enable_offline_queue: false
	});
	let clientDataMapperRedis = new ClientDataMapperRedis(redisClient);

	let client: Client = {
		id: "test:id123",
		secret: "secret123",
		name: "name123" + Math.random(),
		websiteURL: "http://localhost",
		redirectUri: "http://redirectUri",
		type: ClientTypeEnum.PUBLIC
	};

	beforeEach((done) => {
		redisClient.flushdb((err) => {
			if (err) {
				throw err;
			}

			done();
		})
	});
	
	describe("insert", () => {
		it("should insert client to redis", (done) => {
			clientDataMapperRedis.insert(client).then(() => {
				redisClient.get(`client:${client.id}`, (err, result) => {
					let c: Client = JSON.parse(result);
					assert.equal(c.name, client.name);
					done();
				})
			})
		})
	});
/*	
		it("update", () => {
)
	});

	it("hasId", () => {

	});

	it("getById", () => {

	});
*/	
});
