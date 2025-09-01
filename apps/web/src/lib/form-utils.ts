
import { type FieldApi, type FormApi } from '@tanstack/react-form'
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
  Object.entries(errors).forEach(([fieldName, messages]) => {
    if (messages.length > 0) {
      form.setFieldMeta(fieldName, (prev: any) => ({
        ...prev,
        errors: messages,
        errorMap: {
          onSubmit: messages[0],
        }
      }))
    }
  })
}

export function clearFieldErrors(form: any): void {
  Object.keys(form.state.values).forEach(fieldName => {
    form.setFieldMeta(fieldName, (prev: any) => ({
      ...prev,
      errors: [],
      errorMap: {}
    }))
  })
}

export function shouldShowFieldError(field: any): boolean {
  return field.state.meta.isTouched && field.state.meta.errors.length > 0
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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
