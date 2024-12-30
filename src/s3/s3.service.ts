import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(format: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('PRIVET_BUCKET_NAME'),
      Key: `${Date.now()}.${format}`,
      ContentType: contentType,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async getFileUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('PRIVET_BUCKET_NAME'),
      Key: key,
    });
    return getSignedUrl(this.s3Client, command);
  }

  async listFiles(): Promise<any> {
    const command = new ListObjectsV2Command({
      Bucket: this.configService.get('PRIVET_BUCKET_NAME'),
    });
    return this.s3Client.send(command);
  }

  async deleteFile(key: string): Promise<any> {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('PRIVET_BUCKET_NAME'),
      Key: key,
    });
    return this.s3Client.send(command);
  }
}
