import { useMutation } from '@tanstack/react-query';
import { signup } from '../infrastructure/api/auth.api';
import { insertAuthToken } from '../infrastructure/repository/authToken.repo';
import { AuthToken } from '../models/auth-token.model';

export function useSignup() {
  const authSignupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      insertAuthToken(AuthToken.fromSigninOutputDto(data));
    },
  });

  return {
    signup: authSignupMutation.mutateAsync,
  };
}
