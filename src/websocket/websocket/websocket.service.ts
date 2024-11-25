import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketServer } from 'ws';

@Injectable()
export class WebsocketService implements OnModuleInit {
  private wss: WebSocketServer;

  onModuleInit() {
    this.wss = new WebSocketServer({ port: 8080 });

    this.wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // Broadcast the message to all clients
        this.wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(message.toString());
          }
        });
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    console.log('WebSocket server is running on ws://localhost:8080');
  }
}
