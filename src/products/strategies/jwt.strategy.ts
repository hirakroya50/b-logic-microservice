// src/auth/strategies/jwt.strategy.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    // add own strategy to verfy the request

    if (!user) {
      throw new Error('User not found');
    }
    // if (user.id === 1) {
    //   console.log('user one esce -----');
    //   throw new BadRequestException('user one esche333');
    // }
    if (!user.isVerified) {
      return {
        payload,
        user,
        isVerifiedUser: false,
      };
    }

    return {
      payload,
      user,
      isVerifiedUser: true,
    };
  }
}
