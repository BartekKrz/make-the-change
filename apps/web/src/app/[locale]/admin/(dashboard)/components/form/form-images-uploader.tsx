"use client"

import { ImageUploaderField } from '@/components/images/image-uploader'
import { useFieldContext } from './form-context'

export type FormImagesUploaderProps = {
  productId?: string
  multiple?: boolean
  disabled?: boolean
  width?: string
  height?: string
}

export const FormImagesUploader = ({
  productId,
  multiple = true,
  disabled = false,
  width = 'w-full',
  height = 'h-48',
}: FormImagesUploaderProps) => {
  const field = useFieldContext<string[]>()
  const value = field.state.value || []

  return (
    <ImageUploaderField
      field={{
        state: { value },
        handleChange: (updater) => {
          const next = typeof updater === 'function' ? updater(value) : updater
          field.handleChange(next)
        },
      }}
      productId={productId}
      multiple={multiple}
      disabled={disabled}
      width={width}
      height={height}
      onImagesChange={(images) => field.handleChange(images)}
    />
  )
}
