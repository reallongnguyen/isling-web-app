import { apiAxios } from '@/modules/common/axios/axios-instance';
import {
  GetUploadFileUrlInputDto,
  UploadFileOutputDto,
} from '../../models/file.dto';
import axios from 'axios';
import { Profile } from '../../models/profile.model';
import { UpdateProfileInputDto } from '../../models/edit-profile.dto';

export async function getUploadAvatar({
  mimeType,
  fileSize,
}: GetUploadFileUrlInputDto) {
  return apiAxios
    .get<UploadFileOutputDto>(
      `/v1/files/avatars/upload-url?size=${fileSize}&mimeType=${mimeType}`
    )
    .then((res) => res.data);
}

export async function uploadFile({
  file,
  fileSize,
  uploadUrl,
}: GetUploadFileUrlInputDto & { uploadUrl: string; file: File }) {
  return axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'x-goog-content-length-range': `0,${fileSize}`,
    },
  });
}

export async function getProfile() {
  return apiAxios.get<Profile>('/v1/users/profile').then((res) => res.data);
}

export async function updateProfile(input: UpdateProfileInputDto) {
  return apiAxios
    .patch<Profile>('/v1/users/profile', input)
    .then((res) => res.data);
}
