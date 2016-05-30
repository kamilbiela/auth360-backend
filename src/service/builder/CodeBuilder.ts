import * as moment from "moment";
import {ClientId} from "../../model/Client";
import {Code} from "../../model/Code";

export class CodeBuilder {
    clientId: ClientId;
    expiresAt: Date;
    value: string;
    
    constructor() {
        
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
    
    getResult(): Code {
        return {
            id: null,
            clientId: this.clientId,
            expiresAt: this.expiresAt,
            value: this.value
        }
    }
}
