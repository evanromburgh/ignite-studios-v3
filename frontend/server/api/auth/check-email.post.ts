import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const raw = typeof body?.email === 'string' ? body.email.trim() : ''
    const email = raw.toLowerCase()

    if (!email) {
      throw createError({ statusCode: 400, message: 'Email is required' })
    }

    const config = useRuntimeConfig()
    const supabaseUrl = (config.public.supabaseUrl as string)?.trim()
    const serviceRoleKey = (config.supabaseServiceRoleKey as string)?.trim()

    if (!serviceRoleKey || !supabaseUrl) {
      if (import.meta.dev) {
        console.warn(
          '[check-email] Missing SUPABASE_SERVICE_ROLE_KEY or NUXT_PUBLIC_SUPABASE_URL — returning exists: false',
        )
      }
      return { exists: false }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })

    const { data: listData, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })

    if (error) {
      console.error('[check-email] listUsers error:', error.message)
      return { exists: false }
    }

    const users = listData?.users ?? []
    const user = users.find((u) => u.email?.toLowerCase() === email) ?? null
    const exists = !!user

    return { exists }
  } catch (err: unknown) {
    console.error('[check-email] exception:', err instanceof Error ? err.message : err)
    return { exists: false }
  }
})
