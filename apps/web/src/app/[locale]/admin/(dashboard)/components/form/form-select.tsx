"use client"

import { useFieldContext, useFieldErrors } from './form-context'

export type FormSelectProps = {
  label?: string
  placeholder?: string
  required?: boolean
  options: Array<{ value: string; label: string }>
  className?: string
}

export const FormSelect = ({ 
  label, 
  placeholder, 
  required, 
  options, 
  className,
}: FormSelectProps) => {
  const field = useFieldContext<string>()
  const value = (field.state.value as string) ?? ''
  const errors = useFieldErrors()
  const hasError = errors.length > 0

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${hasError ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  )
}
