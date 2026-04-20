import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string

  if (!url || !key) {
    return {
      ok: true,
      supabaseConfigured: false,
      db: null,
    }
  }

  const supabase = createClient(url, key)
  const { data, error } = await supabase.from('health_probe').select('id').maybeSingle()

  if (error) {
    return {
      ok: true,
      supabaseConfigured: true,
      db: { connected: false, message: error.message },
    }
  }

  return {
    ok: true,
    supabaseConfigured: true,
    db: { connected: true, row: data },
  }
})
