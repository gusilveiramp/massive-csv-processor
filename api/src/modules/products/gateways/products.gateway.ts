import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

const port = parseInt(process.env.SOCKET_PORT || '3334');
@WebSocketGateway(port, { cors: { origin: '*' } })
export class ProductsGateway {
  @WebSocketServer() server!: Server;

  @SubscribeMessage('message')
  emitProgress(jobId: string, progress: number) {
    this.server.emit(`upload-progress:${jobId}`, { progress });
  }

  emitCompleted(jobId: string) {
    this.server.emit(`upload-progress:${jobId}`, { progress: 100, done: true });
  }

  emitFailed(jobId: string, reason?: string) {
    this.server.emit(`upload-products:failed:${jobId}`, { reason });
  }
}
