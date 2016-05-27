import {IUuidGenerator} from "./IUuidGenerator";

export class UuidGenerator implements IUuidGenerator {
    constructor(
        private generator: any
    ) {
    }
    
    generate(): string {
        return this.generator.v4();
    }
}