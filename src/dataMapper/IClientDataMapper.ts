import {Client} from "../model/Client";
import {Promise} from "es6-promise";

export interface IClientDataMapper {
    insertOrUpdateClient(client: Client): Promise<void>;
    hasId(id: string): Promise<boolean>;
    getById(id: string): Promise<Client>;
}