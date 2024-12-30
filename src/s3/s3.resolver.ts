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
    const result = await this.s3Service.listFiles();
    if (result?.Contents) {
      return result.Contents.map((item) => item.Key) ?? [];
    }

    // Return an empty array if no files are found
    return [];
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
