import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { WebSocketServer } from 'ws';

@Injectable()
export class WebsocketService implements OnModuleInit {
  private wss: WebSocketServer;
  constructor(private readonly redisService: RedisService) {}
  onModuleInit() {
    this.wss = new WebSocketServer({ port: 8080 });

    this.wss.on('connection', (ws) => {
      console.log('Client connected--1-->');
      ws.on('error', console.error);

      ws.on('message', (message, isBinary) => {
        console.log('Received:--2-->', message.toString());

        ws.send(`Echo: ${message.toString()}`, { binary: isBinary });
      });

      ws.on('close', () => {
        console.log('Client disconnected---3-->');
      });
    });

    console.log('WebSocket server is running on ws://localhost:8080');
    this.redisService.startSubscriber((channel, message) => {
      console.log(
        `Broadcasting message from channel --4--->${channel}:`,
        message,
      );

      this.wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(message);
        }
      });
    });
  }

  // onModuleInit() {
  //   this.wss = new WebSocketServer({ port: 8080 });

  //   this.wss.on('connection', (ws) => {
  //     console.log('Client connected');
  //     ws.on('error', console.error);

  //     ws.on('message', (message, isBinary) => {
  //       console.log('Received:', message.toString());

  //       // Broadcast the message to all clients
  //       this.wss.clients.forEach((client) => {
  //         if (client.readyState === ws.OPEN) {
  //           client.send(message.toString(), { binary: isBinary });
  //         }
  //       });
  //     });

  //     ws.on('close', () => {
  //       console.log('Client disconnected');
  //     });
  //   });

  //   console.log('WebSocket server is running on ws://localhost:8080');
  // }
}
