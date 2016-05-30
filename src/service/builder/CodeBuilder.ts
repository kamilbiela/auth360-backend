import * as moment from "moment";
import {ClientId} from "../../model/Client";
import {Code} from "../../model/Code";
import {IUuidGenerator} from "../IUuidGenerator";
import {Promise} from "es6-promise";

export class CodeBuilder {
    clientId: ClientId;
    expiresAt: Date;
    value: string;
    
    constructor(
        private uuidGenerator: IUuidGenerator
    ) {
    }
    
    setExpiresIn(seconds: number) {
        this.expiresAt = moment().add(seconds, "seconds").toDate();
    }
    
    setClientId(id: ClientId) {
        this.clientId = id;
    }
    
    setValue(value: string) {
        this.value = value;
    }
    
    getResult(): Promise<Code> {
        return new Promise((resolve) => {
            return resolve({
                id: this.uuidGenerator.generate(),
                    clientId: this.clientId,
                expiresAt: this.expiresAt,
                value: this.uuidGenerator.generate()
            });
        });
    }
}
