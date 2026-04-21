/**
 * Auth shell for layout parity. Returns no user until the auth slice is implemented (#3 AC: layout must not depend on real auth).
 */
export interface LayoutAuthUser {
  displayName?: string | null
  email?: string | null
}

export function useAuth() {
  const user = ref<LayoutAuthUser | null>(null)

  async function logout() {
    /* wired when auth ships */
  }

  return { user, logout }
}
