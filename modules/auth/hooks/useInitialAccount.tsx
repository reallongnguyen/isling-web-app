import { useMutation } from '@tanstack/react-query';
import { upsertUser } from '../infrastructure/api/user.api';

export function useInitialAccount() {
  const createUserMutation = useMutation({
    mutationFn: upsertUser,
  });

  return {
    createUser: createUserMutation.mutateAsync,
  };
}
