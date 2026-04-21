import { onMounted, ref } from 'vue'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { AppUser } from '~/types/user'

function mapUserSync(supabaseUser: User | null): AppUser | null {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata ?? {}
  const displayName = typeof meta.display_name === 'string' ? meta.display_name : null
  const firstName = typeof meta.first_name === 'string' ? meta.first_name : null
  const lastName = typeof meta.last_name === 'string' ? meta.last_name : null
  const phone = typeof meta.phone === 'string' ? meta.phone : null
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? null,
    displayName,
    role: 'user',
    firstName,
    lastName,
    phone,
    idPassportNumber: null,
    reasonForBuying: null,
  }
}

async function fetchProfileExtras(
  supabase: SupabaseClient,
  userId: string,
): Promise<Pick<AppUser, 'role' | 'idPassportNumber' | 'reasonForBuying' | 'phone'>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, id_passport_number, reason_for_buying, phone')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return { role: 'user', idPassportNumber: null, reasonForBuying: null, phone: null }
    }
    return {
      role: (data.role as AppUser['role']) ?? 'user',
      idPassportNumber: (data.id_passport_number as string | null) ?? null,
      reasonForBuying: (data.reason_for_buying as string | null) ?? null,
      phone: (data.phone as string | null) ?? null,
    }
  } catch {
    return { role: 'user', idPassportNumber: null, reasonForBuying: null, phone: null }
  }
}

const currentUser = ref<AppUser | null>(null)
const authLoading = ref(true)
const sessionRef = ref<{ access_token: string } | null>(null)

let authSubscriptionDone = false
let initialAuthFetchDone = false

/** Stub until v3 deploys create-lead Edge Function (see issue #5 / Stage 10). */
function stubCreateLeadAfterSignUp(ctx: {
  firstName?: string
  lastName?: string
  email: string
  phone: string
  idPassport: string
  reasonForBuying: string
}) {
  if (!import.meta.client) return
  console.info(
    '[create-lead] Stub: Zoho lead Edge Function not wired in v3 yet. Payload:',
    ctx,
  )
}

export function useAuth() {
  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase

  onMounted(() => {
    const resolveUser = async (supabaseUser: User | null) => {
      const user = mapUserSync(supabaseUser)
      if (!user) {
        currentUser.value = null
        sessionRef.value = null
        return
      }
      currentUser.value = {
        ...user,
        role: 'user',
        idPassportNumber: null,
        reasonForBuying: null,
      }
      if (supabase) {
        void fetchProfileExtras(supabase, user.id).then((profile) => {
          if (!currentUser.value || currentUser.value.id !== user.id) return
          currentUser.value = {
            ...currentUser.value,
            role: profile.role,
            idPassportNumber: profile.idPassportNumber ?? null,
            reasonForBuying: profile.reasonForBuying ?? null,
            phone: profile.phone ?? currentUser.value.phone,
          }
        })
      }
    }

    if (initialAuthFetchDone) {
      return
    }
    initialAuthFetchDone = true

    if (!supabase) {
      currentUser.value = null
      sessionRef.value = null
      authLoading.value = false
      return
    }

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (session?.access_token) {
          sessionRef.value = { access_token: session.access_token }
          const {
            data: { user: serverUser },
            error,
          } = await supabase.auth.getUser()
          if (error || !serverUser) {
            await supabase.auth.signOut()
            currentUser.value = null
            sessionRef.value = null
            authLoading.value = false
            return
          }
          await resolveUser(serverUser)
        } else {
          await resolveUser(null)
        }
        authLoading.value = false
      })
      .catch((err: unknown) => {
        console.warn('[useAuth] getSession failed:', err instanceof Error ? err.name : err)
        authLoading.value = false
      })

    if (!authSubscriptionDone) {
      authSubscriptionDone = true
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.access_token) {
          sessionRef.value = { access_token: session.access_token }
        } else {
          sessionRef.value = null
        }
        void resolveUser(session?.user ?? null)
      })
    }
  })

  const signUp = async (
    email: string,
    password: string,
    name: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    idPassport?: string,
    reasonForBuying?: string,
  ) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          first_name: firstName ?? null,
          last_name: lastName ?? null,
          phone: phone ?? null,
        },
      },
    })

    if (error) throw error

    if (data.user?.id) {
      const updates: Record<string, string> = {}
      if (phone) updates.phone = phone.trim()
      if (idPassport) updates.id_passport_number = idPassport.trim()
      if (reasonForBuying) updates.reason_for_buying = reasonForBuying.trim()
      if (Object.keys(updates).length > 0) {
        await supabase.from('profiles').update(updates).eq('id', data.user.id)
      }
    }

    if (data.user && data.session && firstName && lastName) {
      stubCreateLeadAfterSignUp({
        firstName,
        lastName,
        email,
        phone: phone || '',
        idPassport: idPassport || '',
        reasonForBuying: reasonForBuying || '',
      })
    }

    return data
  }

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    if (!supabase) {
      currentUser.value = null
      sessionRef.value = null
    } else {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      currentUser.value = null
      sessionRef.value = null
    }
    if (import.meta.client) {
      const path = window.location.pathname || '/'
      if (path !== '/' && path !== '') {
        await navigateTo('/', { replace: true })
      }
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    if (error) throw error
  }

  const signInWithOtp = async (email: string) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })
    if (error) throw error
    return data
  }

  const verifyOtp = async (email: string, token: string) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (error) throw error
    return data
  }

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const { exists } = await $fetch<{ exists: boolean }>('/api/auth/check-email', {
      method: 'POST',
      body: { email },
    })
    return exists
  }

  return {
    user: currentUser,
    authLoading,
    sessionRef,
    signUp,
    login,
    logout,
    resetPasswordForEmail,
    signInWithOtp,
    verifyOtp,
    checkEmailExists,
  }
}
