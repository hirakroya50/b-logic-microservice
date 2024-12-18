import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6370,
        });
        return client;
      },
    },
  ],
  controllers: [],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}
