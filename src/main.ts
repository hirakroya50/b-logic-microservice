import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WebsocketModule } from './websocket/websocket.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //CROS policy
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://d2yq29g6vw6zn5.cloudfront.net',
      'https://d145qj8np6zmr.cloudfront.net',
      'http://d145qj8np6zmr.cloudfront.net',
    ], // Allow requests from your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
    credentials: true, // Allow credentials (cookies)
  });
  app.use(cookieParser()); // Enable cookie parsing
  const port = process.env.PORT ?? 3002;

  //--------------------------------------------swagger
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
  //for swager + websocket
  WebsocketModule.setupSwagger(app);
  //--------------------------------------------swagger

  await app.listen(port);
  console.log('Port---', port);
}
bootstrap();
