"use client"

import { forwardRef, type ForwardedRef } from 'react'
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useFieldContext, useFieldErrors } from './form-context'

export type FormTextAreaProps = {
  label?: string
  placeholder?: string
  required?: boolean
  rows?: number
  maxLength?: number
  description?: string
  className?: string
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onBlur'>

const FormTextAreaComponent = (
  { label, placeholder, required, rows = 3, maxLength, description, className, ...props }: FormTextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  const field = useFieldContext<string>()
  const value = field.state.value ?? ''
  const errors = useFieldErrors()
  const hasError = errors.length > 0

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {maxLength && (
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <TextArea
        ref={ref}
        value={value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          hasError && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  )
}

export const FormTextArea = forwardRef(FormTextAreaComponent)
