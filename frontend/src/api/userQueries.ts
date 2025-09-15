import {  useQueryClient } from '@tanstack/react-query';
import { useCurrentUser, useSignIn, useSignUp, useLogout } from './auth';

// Keep this hook for backward compatibility
export const useUser = () => {
  return useCurrentUser(); // Now it uses the TanStack Query version
};

export const useUserInvalidate = () => {
  const queryClient = useQueryClient();
   const invalidateUser = () => {
    queryClient.invalidateQueries({
      queryKey: ['currentUser'],
    });
  };

  return invalidateUser;
};

// Export the new auth hooks for convenience
export { useSignIn, useSignUp, useLogout };