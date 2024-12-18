import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket/websocket.service';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
