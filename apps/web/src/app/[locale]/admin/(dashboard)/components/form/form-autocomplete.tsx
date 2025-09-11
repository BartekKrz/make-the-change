"use client"

import { useFieldContext, useFieldErrors } from './form-context'
import { SingleAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/single-autocomplete'
import { TagsAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/tags-autocomplete'

export type FormAutocompleteProps = {
  mode?: 'single' | 'tags'
  suggestions?: string[]
  placeholder?: string
  className?: string
  disabled?: boolean
  // Single-specific
  allowCreate?: boolean
  // Tags-specific
  maxTags?: number
}

export const FormAutocomplete = ({
  mode = 'single',
  suggestions = [],
  placeholder,
  className,
  disabled,
  allowCreate = true,
  maxTags = 10,
}: FormAutocompleteProps) => {
  if (mode === 'tags') {
    const field = useFieldContext<string[]>()
    const value = field.state.value ?? []
    const errors = useFieldErrors()
    const hasError = errors.length > 0
    return (
      <div className="space-y-1">
        <TagsAutocomplete
          value={value}
          onChange={(tags) => field.handleChange(tags)}
          suggestions={suggestions}
          placeholder={placeholder}
          maxTags={maxTags}
          disabled={disabled}
          className={className}
        />
        {hasError && errors[0] && <p className="text-sm text-red-500">{errors[0]}</p>}
      </div>
    )
  }

  const field = useFieldContext<string | undefined>()
  const value = field.state.value ?? ''
  const errors = useFieldErrors()
  const hasError = errors.length > 0
  return (
    <div className="space-y-1">
      <SingleAutocomplete
        value={value}
        onChange={(v) => field.handleChange(v)}
        suggestions={suggestions}
        placeholder={placeholder}
        allowCreate={allowCreate}
        disabled={disabled}
        className={className}
      />
      {hasError && errors[0] && <p className="text-sm text-red-500">{errors[0]}</p>}
    </div>
  )
}
