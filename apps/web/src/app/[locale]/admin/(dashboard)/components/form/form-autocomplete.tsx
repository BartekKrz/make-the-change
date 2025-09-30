'use client';

import { SingleAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/single-autocomplete';
import { TagsAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/tags-autocomplete';
import {
  useFieldContext,
  useFieldErrors,
} from '@/app/[locale]/admin/(dashboard)/components/form/form-context';

export type FormAutocompleteProps = {
  mode?: 'single' | 'tags';
  suggestions?: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  // Single-specific
  allowCreate?: boolean;
  // Tags-specific
  maxTags?: number;
};

export const FormAutocomplete = ({
  mode = 'single',
  suggestions = [],
  placeholder,
  className,
  disabled,
  allowCreate = true,
  maxTags = 10,
}: FormAutocompleteProps) => {
  // Always call hooks at the top level
  const fieldSingle = useFieldContext<string | undefined>();
  const fieldTags = useFieldContext<string[]>();
  const errors = useFieldErrors();
  const hasError = errors.length > 0;

  if (mode === 'tags') {
    const value = fieldTags.state.value ?? [];
    return (
      <div className="space-y-1">
        <TagsAutocomplete
          className={className}
          disabled={disabled}
          maxTags={maxTags}
          placeholder={placeholder}
          suggestions={suggestions}
          value={value}
          onChange={tags => fieldTags.handleChange(tags)}
        />
        {hasError && errors[0] && (
          <p className="text-sm text-red-500">{errors[0]}</p>
        )}
      </div>
    );
  }

  const value = fieldSingle.state.value ?? '';
  return (
    <div className="space-y-1">
      <SingleAutocomplete
        allowCreate={allowCreate}
        className={className}
        disabled={disabled}
        placeholder={placeholder}
        suggestions={suggestions}
        value={value}
        onChange={v => fieldSingle.handleChange(v)}
      />
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  );
};
