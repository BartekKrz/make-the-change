"use client"

import { useContext } from 'react'
import { createFormHookContexts } from '@tanstack/react-form'

// Single, app-wide contexts provided by TanStack Form utilities
export const { fieldContext, useFieldContext, useFormContext, formContext } = createFormHookContexts()

// Common, typesafe error extraction for the current field
export function useFieldErrors(): string[] {
  const field = useFieldContext<unknown>()
  const toErrorMessage = (u: unknown): string => {
    if (typeof u === 'string') return u
    if (typeof u === 'object' && u && 'message' in u) {
      const msg = (u as { message?: unknown }).message
      if (typeof msg === 'string') return msg
    }
    try {
      return JSON.stringify(u)
    } catch {
      return String(u)
    }
  }
  const raw = (field.state.meta.errors as readonly unknown[] | undefined) ?? []
  return raw.map(toErrorMessage).filter(Boolean)
}
