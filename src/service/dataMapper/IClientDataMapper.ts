import {Client, ClientId} from "../../model/Client";
import * as Promise from "promise";

export interface IClientDataMapper {
    insert(client: Client): Promise.IThenable<ClientId>;
    update(id: ClientId, clientFieldsToUpdate: {[key: string]: any}): Promise.IThenable<void>;
    hasId(id: ClientId): Promise.IThenable<boolean>;
    getById(id: ClientId): Promise.IThenable<Client>;
}
