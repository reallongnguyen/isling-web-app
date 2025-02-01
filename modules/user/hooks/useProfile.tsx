import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUploadAvatar,
  updateProfile,
  uploadFile,
} from '../infrastructure/api/user.api';

export function useProfile() {
  const queryClient = useQueryClient();

  const getUploadAvatarMutation = useMutation({
    mutationFn: getUploadAvatar,
  });
  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
  });
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (value) => {
      queryClient.setQueryData(['v1', 'users', 'profile'], value);
    },
  });

  return {
    getUploadAvatar: getUploadAvatarMutation.mutateAsync,
    uploadFile: uploadFileMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
  };
}
