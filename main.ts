// @todo add env check flag
require('promise/lib/rejection-tracking').enable(
  {allRejections: true}
);

import {App} from "./src/App";
import {configLoader} from "./src/configLoader";

let config = configLoader();
let app = new App(config);

export let startHttpServer = () => {
    app.startHttpServer().then(null, (err) => {
        console.error(err);
    })
};

export let startCli = () => {
    app.startCli();
};
