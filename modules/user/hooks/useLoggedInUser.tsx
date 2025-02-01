import { useMutation } from '@tanstack/react-query';
import { getProfile } from '../infrastructure/api/user.api';
import { useEffect } from 'react';
import { findAuthToken } from '@/modules/auth/infrastructure/repository/authToken.repo';

export default function useLoggedInUser() {
  const { mutate, data } = useMutation({
    mutationFn: getProfile,
    mutationKey: ['v1', 'users', 'profile'],
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const token = findAuthToken();

    if (!token) {
      return;
    }

    mutate();
  }, [mutate]);

  return {
    profile: data,
  };
}
