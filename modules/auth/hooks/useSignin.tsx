import { useMutation } from '@tanstack/react-query';
import { signin } from '../infrastructure/api/auth.api';
import { insertAuthToken } from '../infrastructure/repository/authToken.repo';
import { AuthToken } from '../models/auth-token.model';

export function useSignin() {
  const authSignupMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      insertAuthToken(AuthToken.fromSigninOutputDto(data));
    },
  });

  return {
    signin: authSignupMutation.mutateAsync,
  };
}
