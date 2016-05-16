import {Client} from "../model/Client";
import {Promise} from "es6-promise";

export interface IClientDataMapper {
    insert(client: Client): Promise<string>;
    update(id: string, clientFieldsToUpdate: {[key: string]: any}): Promise<void>;
    hasId(id: string): Promise<boolean>;
    getById(id: string): Promise<Client>;
}