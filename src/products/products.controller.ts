import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard) // Protect the endpoint
  findAll(@Request() req) {
    console.log('req==', req.user);
    return this.productsService.findAll();
  }
}
