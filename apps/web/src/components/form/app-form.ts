
import { useForm } from '@tanstack/react-form';

import type { ReturnType } from '@tanstack/react-form';

export const useAppForm = useForm;

export type AppFormApi = ReturnType<typeof useAppForm>;
