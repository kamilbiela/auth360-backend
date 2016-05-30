// @todo extract enum to separate file
export enum ClientTypeEnum {
    CONFIDENTAL = 1,
    PUBLIC
} 

export type ClientId = string;

export interface Client {
    id: ClientId;
	name: string;
	websiteUrl: string;
	redirectUri: string;
	secret: string;
	type: ClientTypeEnum;
}
