import {Promise} from "es6-promise";
import {Client, ClientId} from "../../model/Client";
import {IRedisClient} from "../../service/IRedisClient";
import {IClientDataMapper} from "../IClientDataMapper";
import {BaseDataMapperRedis} from "./BaseDataMapperRedis";
import * as _ from "lodash";

export class ClientDataMapperRedis extends BaseDataMapperRedis<Client, ClientId> implements IClientDataMapper {
    protected objectName = "client";

    constructor(
        redisClient: IRedisClient
    ) {
        super(redisClient);
    }
}
