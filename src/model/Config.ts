export interface Config {
    http: {
        port: number;
    };

    debug: {
        level: string;
    };

    accessToken: {
        expiresIn: number
    }
}
