"use client"

import { useFieldContext, useFieldErrors } from './form-context'

export type FormToggleProps = {
  label: string
  description?: string
  className?: string
  hideLabel?: boolean
}

export const FormToggle = ({ 
  label, 
  description, 
  className,
  hideLabel = false,
}: FormToggleProps) => {
  const field = useFieldContext<boolean>()
  const checked = Boolean(field.state.value)
  const errors = useFieldErrors()
  const hasError = errors.length > 0

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={hideLabel ? undefined : label}
          checked={checked}
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
          aria-label={hideLabel ? label : undefined}
          className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${className}`}
        />
        <div className="grid gap-1.5 leading-none">
          {!hideLabel && (
            <label
              htmlFor={label}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  )
}
