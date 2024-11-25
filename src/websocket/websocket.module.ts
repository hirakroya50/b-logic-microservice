import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket/websocket.service';

@Module({
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
