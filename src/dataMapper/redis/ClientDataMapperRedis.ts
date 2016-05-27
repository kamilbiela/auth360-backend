import {Client, ClientId} from "../../model/Client";
import {IRedisClient} from "../../service/IRedisClient";
import {IClientDataMapper} from "../../service/dataMapper/IClientDataMapper";
import {BaseDataMapperRedis} from "./BaseDataMapperRedis";

export class ClientDataMapperRedis extends BaseDataMapperRedis<Client, ClientId> implements IClientDataMapper {
    protected objectName = "client";

    constructor(
        redisClient: IRedisClient
    ) {
        super(redisClient);
    }
}
