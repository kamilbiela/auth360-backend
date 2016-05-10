import startServer from "./src/server";
import {Config} from "./src/model/config";

startServer(new Config()).then(() => {
    console.log("server running");
}).catch((err) => {
    console.error("Server error: ");
    console.error(err); 
});