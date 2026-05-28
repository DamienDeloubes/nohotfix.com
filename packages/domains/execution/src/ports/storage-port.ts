export interface StoragePort {
  generatePutUrl(data: { key: string; contentType: string; fileSize: number }): Promise<string>;
}
