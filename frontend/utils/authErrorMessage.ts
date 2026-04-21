/** Normalize Supabase / fetch errors for display. */
export function authErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null) {
    const o = err as { message?: string; error?: { message?: string } }
    if (typeof o.message === 'string') return o.message
    if (typeof o.error?.message === 'string') return o.error.message
  }
  return fallback
}
