"use client"

import { forwardRef, type ForwardedRef } from 'react'
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input'
import { cn } from '@/lib/utils'
import { useFieldContext, useFieldErrors } from './form-context'

export type FormNumberFieldProps = {
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
  kind?: 'int' | 'float'
  emptyValue?: number | null | undefined
  step?: number | string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur' | 'size' | 'type' | 'step'>

const FormNumberFieldComponent = (
  { label, placeholder, required, className, kind = 'int', emptyValue = undefined, step, ...props }: FormNumberFieldProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const field = useFieldContext<number | null | undefined>()

  const rawValue = field.state.value
  const value = rawValue === null || rawValue === undefined ? '' : String(rawValue)
  const errors = useFieldErrors()
  const hasError = errors.length > 0

  const handleChange = (s: string) => {
    if (s === '') {
      field.handleChange(emptyValue)
      return
    }
    if (kind === 'float') {
      const n = Number.parseFloat(s)
      field.handleChange(Number.isNaN(n) ? emptyValue : n)
    } else {
      const n = Number.parseInt(s, 10)
      field.handleChange(Number.isNaN(n) ? emptyValue : n)
    }
  }

  return (
    <div className="space-y-1">
      {/* label non rendu ici par défaut, DetailView gère l'affichage du label */}
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        step={step}
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

export const FormNumberField = forwardRef(FormNumberFieldComponent)
