import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis(process.env.REDIS_URL);
        return client;
      },
    },
  ],
  controllers: [],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}
