import type { StoragePort } from '@nohotfix/domain-execution';

export class PresignedUrlAdapter implements StoragePort {
  async generatePutUrl(_data: { key: string; contentType: string; fileSize: number }): Promise<string> {
    // TODO: Validate constraints, generate DO Spaces presigned URL
    return 'https://placeholder.example.com';
  }
}
