'use client';

import { forwardRef } from 'react';

import { TextArea, type TextAreaProps } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';
import { FormField, type FormFieldProps } from '@/components/form/form-field';

import type { FieldApi } from '@tanstack/react-form';
import type { ForwardedRef } from 'react';

type FormTextAreaProps = FormFieldProps &
  Omit<TextAreaProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'error' | 'label'> & {
    field?: FieldApi<any, any, any, any>;
  };

const FormTextAreaComponent = (
  { field, label, description, className, required, ...textAreaProps }: FormTextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  if (!field) {
    throw new Error('FormTextArea requires a field prop when used with TanStack Form');
  }

  const fieldName = String(field.name);
  const fieldId = `field-${fieldName}`;

  return (
    <FormField
      className={className}
      description={description}
      error={field.state.meta.errors?.[0]}
      fieldId={fieldId}
      isValidating={field.state.meta.isValidating}
      label={label}
      required={required}
    >
      <TextArea
        ref={ref}
        id={fieldId}
        name={fieldName}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...textAreaProps}
      />
    </FormField>
  );
};

FormTextAreaComponent.displayName = 'FormTextAreaComponent';

export const FormTextArea = forwardRef(FormTextAreaComponent);
FormTextArea.displayName = 'FormTextArea';
