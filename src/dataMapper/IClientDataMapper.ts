import {Client, ClientId} from "../model/Client";
import {Promise} from "es6-promise";

export interface IClientDataMapper {
    insert(client: Client): Promise<ClientId>;
    update(id: ClientId, clientFieldsToUpdate: {[key: string]: any}): Promise<void>;
    hasId(id: ClientId): Promise<boolean>;
    getById(id: ClientId): Promise<Client>;
}