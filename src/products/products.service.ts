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

  async findAll() {
    const allUser = await this.prismaService.user.findMany();
    return allUser;
  }

  async accessTokenTest({ req, res }: { req: ExpressRequest; res: Response }) {
    try {
      // Extract refresh token from cookies
      const accessToken = req?.cookies?.accessToken;
      console.log('refresh token ======', accessToken);

      if (!accessToken) {
        throw new HttpException(
          'No accessToken  provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Return a success response
      return res.status(HttpStatus.OK).json({ accessToken });
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
