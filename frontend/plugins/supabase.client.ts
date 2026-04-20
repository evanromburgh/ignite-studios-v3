import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseAnonKey = config.public.supabaseAnonKey as string

  if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.dev) {
      console.warn(
        '[supabase] Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env',
      )
    }
    return { provide: { supabase: null as SupabaseClient | null } }
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return { provide: { supabase } }
})
