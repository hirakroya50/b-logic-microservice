import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //CROS policy
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow requests from your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept', // Allowed headers
    credentials: true, // Allow credentials (cookies)
  });
  app.use(cookieParser()); // Enable cookie parsing
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log('Port---', port);
}
bootstrap();
