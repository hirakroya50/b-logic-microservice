import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Resolver } from './s3.resolver';

@Module({
  imports: [ConfigModule],
  providers: [S3Service, S3Resolver],
})
export class S3Module {}
