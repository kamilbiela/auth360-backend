import IConfig from "./IConfig";

export interface IServiceContainer {
    config: IConfig
}

export class ServiceContainer implements IServiceContainer {
    
    get config(): IConfig {
        return {
            http: {
                port: 4123
            }
        }
    }
}
