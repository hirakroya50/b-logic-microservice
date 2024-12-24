import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { WebSocketServer } from 'ws';

@Injectable()
export class WebsocketService implements OnModuleInit {
  private redis_WS_Server: WebSocketServer;
  private chat_WS_Server: WebSocketServer;
  constructor(private readonly redisService: RedisService) {}
  onModuleInit() {
    // Chat WebSocket Server
    this.chat_WS_Server = new WebSocketServer({ port: 8080 });
    this.setupChatWebSocketServer(this.chat_WS_Server);

    // Redis Pub/Sub WebSocket Server
    this.redis_WS_Server = new WebSocketServer({ port: 8081 });
    this.setupRedisWebSocketServer(this.redis_WS_Server);

    console.log('WebSocket servers are running:');
    console.log('Redis Pub/Sub: ws://localhost:8081');
    console.log('Chat Application: ws://localhost:8080');
  }

  private setupRedisWebSocketServer(wss: WebSocketServer) {
    wss.on('connection', (ws) => {
      console.log('Redis Pub/Sub - Client connected');

      ws.on('error', console.error);

      ws.on('close', () => {
        console.log('Redis Pub/Sub - Client disconnected');
      });
    });

    // Subscribe to Redis messages and broadcast to all connected clients
    this.redisService.startSubscriber((pubsubKey, message) => {
      console.log(`Redis Pub/Sub - Broadcasting message: ${message}`);
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(`Redis message from ${pubsubKey}: ${message}`);
        }
      });
    });
  }

  private setupChatWebSocketServer(wss: WebSocketServer) {
    wss.on('connection', (ws) => {
      console.log('Chat Application - Client connected');

      ws.on('error', console.error);

      ws.on('message', (message, isBinary) => {
        console.log('Chat Application - Received:', message.toString());

        // Broadcast the chat message to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(`Chat message: ${message.toString()}`, {
              binary: isBinary,
            });
          }
        });
      });

      ws.on('close', () => {
        console.log('Chat Application - Client disconnected');
      });
    });
  }
}
