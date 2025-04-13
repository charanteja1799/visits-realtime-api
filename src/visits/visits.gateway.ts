import { WebSocketGateway, OnGatewayInit, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { MongoService } from "src/mongo/mongo.service";

@WebSocketGateway({ cors: true })
export class VisitsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly mongoService: MongoService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized.');
    this.mongoService.setSocketServer(server); // critical!
  }
}
