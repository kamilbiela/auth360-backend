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
		name: "name123",
		websiteURL: "http://localhost",
		redirectUri: "http://redirectUri",
		type: ClientTypeEnum = ClientTypeEnum.PUBLIC
	};
	
	describe("insert", () => {
		it("should save cl ", (done) => {
			clientDataMapperRedis.insert(client).then(() => {
				redisClient.get(`client:${client.id}`, (err, result) => {
					console.log("Test");
					console.log(err);
					console.log(result);
					done();
				})
			})
			
		})
	});

	it("update", () => {
)
	});

	it("hasId", () => {

	});

	it("getById", () => {

	});
});
