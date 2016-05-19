import {App} from "./src/App";
import {configLoader} from "./src/configLoader";

let config = configLoader();
let app = new App(config);

export let startHttpServer = () => {
    app.startHttpServer();
};

export let startCli = () => {
    app.startCli();
};
