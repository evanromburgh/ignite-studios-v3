import { CONFIG } from '~/config'

/** Shared signup steps 2–3: name + password rules. */
export function validateSignupIdentity(
  firstName: string,
  lastName: string,
  password: string,
): string | null {
  if (!firstName.trim()) return 'First name is required.'
  if (!lastName.trim()) return 'Last name is required.'
  if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${CONFIG.PASSWORD_MIN_LENGTH} characters.`
  }
  return null
}
