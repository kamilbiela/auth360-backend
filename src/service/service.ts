import {ClientBuilder} from "./clientBuilder.ts";

export class ServiceContainer {
    getClientBuilderInstance(): ClientBuilder {
        return new ClientBuilder();
    }
}

export let serviceContainer = new ServiceContainer();
