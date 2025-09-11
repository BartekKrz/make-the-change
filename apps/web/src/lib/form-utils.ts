
import { type ZodType } from 'zod'

export type InferZodSchema<T> = T extends ZodType<infer U> ? U : never

export type BaseFormOptions<T = any> = {
  defaultValues: T
  validatorAdapter: any
}

export type FormMutationResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export type FormToastConfig = {
  success?: {
    title: string
    description?: string
  }
  error?: {
    title: string
    description?: string
  }
}

export function mapServerErrorsToFields(
  errors: Record<string, string[]> = {},
  form: any
): void {
  for (const [fieldName, messages] of Object.entries(errors)) {
    if (messages.length > 0) {
      form.setFieldMeta(fieldName, (prev: any) => ({
        ...prev,
        errors: messages,
        errorMap: {
          onSubmit: messages[0],
        }
      }))
    }
  }
}

export function clearFieldErrors(form: any): void {
  for (const fieldName of Object.keys(form.state.values)) {
    form.setFieldMeta(fieldName, (prev: any) => ({
      ...prev,
      errors: [],
      errorMap: {}
    }))
  }
}

export function shouldShowFieldError(field: any): boolean {
  return field.state.meta.isTouched && field.state.meta.errors.length > 0
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replaceAll(/[^\d\sa-z-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const VALIDATION_DELAYS = {
  fast: 300,
  normal: 500,
  slow: 1000,
} as const

export type FieldErrorProps = {
  field: any
  showWhen?: 'touched' | 'dirty' | 'always'
}

export type FormFieldWrapperProps = {
  label: string
  required?: boolean
  description?: string
  className?: string
  children: React.ReactNode
}
