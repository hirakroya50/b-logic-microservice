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

  @Get()
  @UseGuards(JwtAuthGuard) // Protect the endpoint
  findAll(@Request() req) {
    console.log('req==', req.user);
    return this.productsService.findAll();
  }

  @Post('/access-token-test')
  async accessTokenTest(@Req() req: ExpressRequest, @Res() res: Response) {
    return this.productsService.accessTokenTest({ req, res });
  }
}
