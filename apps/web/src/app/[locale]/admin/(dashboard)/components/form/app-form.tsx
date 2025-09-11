"use client"

import { createFormHook } from '@tanstack/react-form'

import { FormAutocomplete } from './form-autocomplete'
import { fieldContext, formContext } from './form-context'
import { FormDateField } from './form-date-field'
import { FormImagesUploader } from './form-images-uploader'
import { FormNumberField } from './form-number-field'
import { FormSelect } from './form-select'
import { FormTextField } from './form-text-field'
import { FormTextArea } from './form-textarea'
import { FormToggle } from './form-toggle'

import type {
  FormTextFieldProps,
  FormTextAreaProps,
  FormSelectProps,
  FormToggleProps,
  FormAutocompleteProps,
  FormDateFieldProps,
  FormNumberFieldProps,
  FormImagesUploaderProps,
} from './index'
import type { ComponentType } from 'react'

// Map des composants de champ disponibles via field.FormX, typés précisément
const fieldComponents: {
  FormTextField: ComponentType<FormTextFieldProps>
  FormTextArea: ComponentType<FormTextAreaProps>
  FormSelect: ComponentType<FormSelectProps>
  FormToggle: ComponentType<FormToggleProps>
  FormAutocomplete: ComponentType<FormAutocompleteProps>
  FormDateField: ComponentType<FormDateFieldProps>
  FormNumberField: ComponentType<FormNumberFieldProps>
  FormImagesUploader: ComponentType<FormImagesUploaderProps>
} = {
  FormTextField,
  FormTextArea,
  FormSelect,
  FormToggle,
  FormAutocomplete,
  FormDateField,
  FormNumberField,
  FormImagesUploader,
}

// Composants de formulaire additionnels si besoin (vide pour l'instant)
const formComponents: Record<string, ComponentType<unknown>> = {}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents,
  fieldContext,
  formContext,
  formComponents,
})
