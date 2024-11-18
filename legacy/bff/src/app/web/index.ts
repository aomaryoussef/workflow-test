import { config } from "../../../config";
import server from "./server";

const port = config.port;
const SERVER_START_MSG = "Express server started on port: " + port;

server.listen(port, () => console.log(SERVER_START_MSG));
