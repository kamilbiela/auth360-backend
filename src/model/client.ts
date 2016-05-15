/**
 * interface used for creating object update in rest api
 */
export interface ClientUpdate {
    name: string;
    websiteURL: string;
    redirectUri: string;
}

export class Client implements ClientUpdate {
    constructor(
        public name: string,
        public websiteURL: string,
        public redirectUri: string,
        public id: string,
        public secret: string
    ) {
    }
}