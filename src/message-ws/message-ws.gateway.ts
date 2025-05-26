import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true, namespace: 'message' })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(
    private readonly messageWsService: MessageWsService,

    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload
    try {

      payload = this.jwtService.verify(token)

      await this.messageWsService.registerClient(client, payload.id);
  
      this.wss.emit('clients-updated', this.messageWsService.getConnectedClients()); 
    } catch (error) {
      client.disconnect()
      return
    }
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
    this.messageWsService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log('Message from client:', payload);
    // this.wss.emit('message-from-server', {
    //   fullName: 'Server',
    //   message: payload.message || 'no-message'
    // });


    //! emite unicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: this.messageWsService.getConnectedClients(),
    //   message: payload.message || 'no-message'
    // })

    // Emitir a todos MENOS, al cliente 
    client.broadcast.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no-message'
    });

    // Emitir a todos
    // this.wss.emit('message-from-server', {
    //   fullName: this.messageWsService.getConnectedClients(),
    //   message: payload.message || 'no-message'
    // });
  }

}
