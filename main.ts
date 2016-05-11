import startServer from "./src/server";
import {serviceContainer} from "./src/service/serviceContainer";

startServer(serviceContainer).then(() => {
    console.log("server running");
}).catch((err) => {
    console.error("Server error: ");
    console.error(err); 
});