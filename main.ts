import {App} from "./src/App";
import {configLoader} from "./src/configLoader";

let config = configLoader();
let app = new App(config);

app.startHttpServer().then(() => {
    console.log("running");
});
