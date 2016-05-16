import * as Hapi from "hapi";

export interface IRoute {
	(...args: any[]): Hapi.IRouteConfiguration
}
