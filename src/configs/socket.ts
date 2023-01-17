import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { LocationProps } from "../types";

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;
  public users: { [uid: string]: string };
  public currentOneLocation: LocationProps = {
    lat: -12.026957954416517,
    lng: -77.06472011954492,
  };
  private currentTwoLocation: LocationProps = {
    lat: -12.042625817899827,
    lng: -77.07279027343546,
  };

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*",
      },
    });
    this.io.on("connect", this.startListener);
    // console.info("Socket ID started.");
  }

  async startListener(socket: Socket) {
    // console.log("El socket con el id " + socket.id);
    socket.on("updateMarkerOne", (data) => {
      ServerSocket.instance.currentOneLocation = data;
      socket.broadcast.emit(
        "updateMarkerOne",
        ServerSocket.instance.currentOneLocation
      );
    });
    socket.on("updateMarkerTwo", (data) => {
      ServerSocket.instance.currentTwoLocation = data;
      socket.broadcast.emit(
        "updateMarkerTwo",
        ServerSocket.instance.currentTwoLocation
      );
    });
    socket.emit("sendInitialLocation", {
      currentOneLocation: ServerSocket.instance.currentOneLocation,
      currentTwoLocation: ServerSocket.instance.currentTwoLocation,
    });

    socket.on("disconnect", async () => {
      await ServerSocket.instance.sendCountUsers();
    });

    await ServerSocket.instance.sendCountUsers();
  }

  async sendCountUsers() {
    const sockets = await ServerSocket.instance.io.fetchSockets();
    for (let s of sockets) {
      s.emit("countActiveUsers", sockets.length);
    }
  }
}
