import { trpc } from '@/lib/trpc';

import type { AppRouter } from '@make-the-change/api';
import type { UseTRPCMutationResult } from '@trpc/react-query/shared';
import type { inferProcedureInput } from '@trpc/server';

type ProductUpdateInput = inferProcedureInput<
  AppRouter['admin']['products']['update']
>;
type UseProductUpdateMutationResult = Pick<
  UseTRPCMutationResult<unknown, unknown, ProductUpdateInput, unknown>,
  'mutate' | 'mutateAsync' | 'variables' | 'status'
>;

export const useProductUpdateMutation = (): UseProductUpdateMutationResult => {
  const mutation = trpc.admin.products.update.useMutation();

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    variables: mutation.variables,
    status: mutation.status,
  };
};
