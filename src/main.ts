import express from "express";
import dotenv from "dotenv";
if (process.env.TYPE !== "PRODUCTION") {
  dotenv.config();
}
import { createServer } from "http";
import { ServerSocket } from "./configs/socket";

import cors from "cors";
const app = express();
const server = createServer(app);
new ServerSocket(server);

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

server.listen(process.env.PORT, () => {
  console.log(
    `La aplicación se está ejecutando en el puerto ${process.env.PORT}.`
  );
});
