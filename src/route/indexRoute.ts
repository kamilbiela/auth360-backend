import * as Hapi from "hapi";

let route:Hapi.IRouteConfiguration = {
	method: "GET",
	path: "/",
	handler: (request, reply) => {
		reply('hello');
	}
};

export default route;
