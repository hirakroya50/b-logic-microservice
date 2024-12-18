import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: Redis) {}
  async startSubscriber(onMessage: (channel: string, message: string) => void) {
    try {
      await this.redisClient.subscribe(process.env.REDIS_PUB_SUB_KEY);

      this.redisClient.on('message', (channel, message) => {
        console.log(`Received message from channel ${channel}:`, message);
        onMessage(channel, message);
      });
    } catch (error) {
      console.error(error, '===errro');
    }
  }
}
