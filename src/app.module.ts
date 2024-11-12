import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './products/guards/jwt-auth.guard';
import { JwtStrategy } from './products/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '60m',
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
    }),

    ProductsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService, JwtStrategy, JwtAuthGuard],
})
export class AppModule {}
