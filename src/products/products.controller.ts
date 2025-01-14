import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response, Request as ExpressRequest } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/protected-route')
  @UseGuards(JwtAuthGuard) // Protect the endpoint
  findAll(@Request() req) {
    // console.log('req==', req.user);
    return this.productsService.findAll(req);
  }

  @Post('/refresh-token-test')
  async refreshTokenTest(@Req() req: ExpressRequest, @Res() res: Response) {
    return this.productsService.refreshTokenTest({ req, res });
  }
}
