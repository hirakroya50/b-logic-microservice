import { Module, OnModuleInit } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { RedisModule } from 'src/redis/redis.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Module({
  imports: [RedisModule],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
// code modification for swagger
export class WebsocketModule implements OnModuleInit {
  constructor(private readonly websocketService: WebsocketService) {}

  onModuleInit() {
    // Swagger configuration can be used later in the main app setup, not here.
    console.log('WebsocketModule initialized.');
  }

  static setupSwagger(app: any): void {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('WebSocket API')
      .setDescription(
        `## WebSocket Servers:
        - **Chat Server**: ws://localhost:8080
          - Broadcasts messages to all connected clients.
          - Clients can send messages in plain text.
        - **Redis Pub/Sub Server**: ws://localhost:8081
          - Listens for Redis Pub/Sub messages and broadcasts them to all connected clients.
        `,
      )
      .setVersion('1.0')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    // Serve Swagger UI
    SwaggerModule.setup('api-docs', app, swaggerDocument);
  }
}
