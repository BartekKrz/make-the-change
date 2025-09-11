'use client'

import { type FC } from 'react'

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/ui/badge'
import { Checkbox } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox'
import { useAppForm } from '@/components/form'


type FormCheckboxProps = {
  label: string
  description?: string
  trueBadge?: string
  falseBadge?: string
}

export const FormCheckbox: FC<FormCheckboxProps> = ({
  label,
  description,
  trueBadge,
  falseBadge,
}) => {
  // Ce hook est une supposition basée sur l'usage de FormInput etc.
  // Il doit être fourni par le contexte de useAppForm
  const field = useAppForm.useField()

  return (
    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={Boolean(field.state.value)}
        id={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {field.state.value && trueBadge && <Badge color="green">{trueBadge}</Badge>}
      {!field.state.value && falseBadge && <Badge color="gray">{falseBadge}</Badge>}
    </label>
  )
}
