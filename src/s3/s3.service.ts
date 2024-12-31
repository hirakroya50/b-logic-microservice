import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('SECRET_ACCESS_KEY'),
      },
    });
  }

  private getBucketName(): string {
    const bucketName = this.configService.get<string>('PRIVET_BUCKET_NAME');
    if (!bucketName) {
      throw new BadRequestException('Bucket name is not configured.');
    }
    return bucketName;
  }

  /**
   * Generate a pre-signed URL for uploading a file to S3.
   * @param format - The file format (e.g., jpg, png, etc.)
   * @param contentType - The MIME type of the file.
   * @returns The pre-signed URL for uploading the file.
   */
  async uploadFile(format: string, contentType: string): Promise<string> {
    try {
      const bucketName = this.getBucketName();

      if (!format || !contentType) {
        throw new Error(
          'Invalid arguments. Format and contentType are required.',
        );
      }

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${Date.now()}.${format}`,
        ContentType: contentType,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Error generating upload URL:', error);
      throw new InternalServerErrorException('Failed to generate upload URL.');
    }
  }

  /**
   * Generate a pre-signed URL for retrieving a file from S3.
   * @param key - The key of the file in the S3 bucket.
   * @returns The pre-signed URL for retrieving the file.
   */
  async getFileUrl(key: string): Promise<string> {
    try {
      const bucketName = this.getBucketName();

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command);
    } catch (error) {
      console.error(`Error retrieving file URL for key "${key}":`, error);
      throw new InternalServerErrorException('Failed to retrieve file URL.');
    }
  }

  /**
   * List all files in the configured S3 bucket.
   * @returns An array of file keys in the S3 bucket.
   */
  async listFiles(): Promise<string[]> {
    try {
      const bucketName = this.getBucketName();

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
      });
      let result = await this.s3Client.send(command);

      if (result?.Contents) {
        return result.Contents.map((item) => item.Key) ?? [];
      }
      return [];
    } catch (error) {
      console.error('Error listing files in S3 bucket:', error);
      throw new Error(
        'Unable to list files from S3. Please check your configuration or permissions.',
      );
    }
  }

  /**
   * Delete a file from the S3 bucket.
   * @param key - The key of the file to be deleted.
   * @returns A promise indicating the success of the delete operation.
   */
  async deleteFile(key: string): Promise<any> {
    try {
      const bucketName = this.getBucketName();
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      return this.s3Client.send(command);
    } catch (error) {
      console.error(`Error deleting file with key "${key}":`, error);
      throw new InternalServerErrorException('Failed to delete file from S3.');
    }
  }
}
