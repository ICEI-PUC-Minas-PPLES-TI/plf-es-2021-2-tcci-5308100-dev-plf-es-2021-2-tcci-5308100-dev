import { Injectable } from '@nestjs/common';
import {
  FileServiceResult,
  FileValidityOptions,
  Uploadable,
} from './uploadable.interface';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
  DeleteObjectsCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class FilesService implements Uploadable {
  private uploadClient: S3Client;

  constructor() {
    this.uploadClient = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },

      ...(process.env.NODE_ENV === 'development'
        ? {
            endpoint: process.env.LOCALSTACK_S3_ENDPOINT,
            forcePathStyle: true,
          }
        : undefined),
    });
    return;
  }

  checkFileValidity(
    file: Express.Multer.File,
    { allowedMimeType, maxSize }: FileValidityOptions = {
      allowedMimeType: ['image/*'],
      maxSize: 10485760,
    },
  ) {
    const isValidMimeType = allowedMimeType.some((mimeType) => {
      const mimeTypeSplitted = mimeType.split('/');
      if (mimeTypeSplitted[1] === '*')
        return mimeTypeSplitted[0] === file.mimetype.split('/').shift();
      else return mimeType === file.mimetype;
    });

    if (!isValidMimeType)
      throw new Error('A extensão do arquivo não é permitida.');
    else if (file.size > maxSize)
      throw new Error('O arquivo supera o tamanho máximo permitido.');
    else return true;
  }

  async saveFile(
    file: Express.Multer.File,
    filename: string = file.originalname,
    options?: FileValidityOptions,
  ): Promise<FileServiceResult<PutObjectCommandOutput>> {
    try {
      this.checkFileValidity(file, options);

      const data = await this.uploadClient.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: filename,
          Body: file.buffer,
          ACL: 'public-read',
        }),
      );

      return { success: true, data, error: undefined };
    } catch (error) {
      return { success: false, error, data: undefined };
    }
  }

  async saveFileWithRetry(
    file: Express.Multer.File,
    filename: string = file.originalname,
    options?: FileValidityOptions,
    retries = 3,
  ) {
    const result = await this.saveFile(file, filename, options);

    if (result.success) return result;
    else if (retries > 1)
      return this.saveFileWithRetry(file, filename, options, retries--);
    else return result;
  }

  async deleteFile(
    filename: string,
  ): Promise<FileServiceResult<DeleteObjectCommandOutput>> {
    try {
      const data = await this.uploadClient.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: filename,
        }),
      );

      return { success: true, data, error: undefined };
    } catch (error) {
      return { success: false, error, data: undefined };
    }
  }

  async deleteFiles(
    filenames: string[],
  ): Promise<FileServiceResult<DeleteObjectsCommandOutput>> {
    try {
      const data = await this.uploadClient.send(
        new DeleteObjectsCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Delete: { Objects: filenames.map((filename) => ({ Key: filename })) },
        }),
      );

      return { success: true, data, error: undefined };
    } catch (error) {
      return { success: false, error, data: undefined };
    }
  }
}
