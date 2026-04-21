const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSingleEmail(
  raw: string,
): { ok: true; email: string } | { ok: false; message: string } {
  const emailVal = raw.trim()
  if (!emailVal) return { ok: false, message: 'Email is required.' }
  if (!EMAIL_RE.test(emailVal)) return { ok: false, message: 'Please enter a valid email address.' }
  return { ok: true, email: emailVal }
}

export function validateEmailWithConfirm(
  rawEmail: string,
  rawConfirm: string,
): { ok: true; email: string } | { ok: false; message: string } {
  const single = validateSingleEmail(rawEmail)
  if (!single.ok) return single
  if (rawConfirm.trim() !== single.email) return { ok: false, message: 'Emails do not match.' }
  return single
}
