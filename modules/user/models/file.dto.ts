export interface GetUploadFileUrlInputDto {
  mimeType: string;
  fileSize: number;
}

export interface UploadFileOutputDto {
  uploadUrl: string;
  expires: number;
  objectUrl: string;
  signedUrl: string;
}
