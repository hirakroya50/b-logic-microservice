import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response, Request as ExpressRequest } from 'express';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(req) {
    const { payload, isVerifiedUser } = req?.user;
    return {
      payload,
      status: 'Dummy operation successful',
      message: `user is using a protected route. user: ${isVerifiedUser ? 'VERIFIED' : 'NOT-VERIFIED'}`,
    };
  }

  async refreshTokenTest({ req, res }: { req: ExpressRequest; res: Response }) {
    try {
      // Extract refresh token from cookies
      const refreshToken = req?.cookies?.refreshToken;
      console.log('refresh token ======>', refreshToken);

      if (!refreshToken) {
        throw new HttpException(
          'No refreshToken  provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Return a success response
      return res.status(HttpStatus.OK).json({ refreshToken });
    } catch (error) {
      console.error('Error during refresh token:', error.message);

      // Return an error response
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
