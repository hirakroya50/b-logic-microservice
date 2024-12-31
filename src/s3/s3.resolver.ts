import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { S3Service } from './s3.service';

@Resolver()
export class S3Resolver {
  constructor(private readonly s3Service: S3Service) {}

  @Mutation(() => String)
  async getUploadUrl(
    @Args('format') format: string,
    @Args('contentType') contentType: string,
  ): Promise<string> {
    return this.s3Service.uploadFile(format, contentType);
  }

  @Query(() => [String])
  async listFiles(): Promise<string[]> {
    return await this.s3Service.listFiles();
  }

  @Query(() => String)
  async getFileUrl(@Args('fileKey') fileKey: string): Promise<string> {
    return this.s3Service.getFileUrl(fileKey);
  }

  @Mutation(() => Boolean)
  async deleteFile(@Args('fileKey') fileKey: string): Promise<boolean> {
    await this.s3Service.deleteFile(fileKey);
    return true;
  }
}
