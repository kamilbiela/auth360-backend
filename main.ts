import startServer from "./src/server";

startServer({}).then(() => {
    console.log("server running");
}).catch((err) => {
    console.error("Server error: ");
    console.error(err); 
});