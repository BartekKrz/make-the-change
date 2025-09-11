"use client"

import { createFormHookContexts } from '@tanstack/react-form'

// Single, app-wide contexts provided by TanStack Form utilities
export const { fieldContext, useFieldContext, useFormContext, formContext } = createFormHookContexts()

// Helper function extracted to outer scope for better performance
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

// Common, typesafe error extraction for the current field
export function useFieldErrors(): string[] {
  const field = useFieldContext<unknown>()
  const raw = (field.state.meta.errors as readonly unknown[] | undefined) ?? []
  return raw.map((error) => toErrorMessage(error)).filter(Boolean)
}
