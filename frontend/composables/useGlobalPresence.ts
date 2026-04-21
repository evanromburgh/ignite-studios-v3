/**
 * Site-wide "browsing now" count using Supabase Realtime presence (same channel pattern as v2).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'

const onlineCount = ref(0)
let channel: RealtimeChannel | null = null

export function useGlobalPresence() {
  const nuxtApp = useNuxtApp()

  onMounted(() => {
    if (import.meta.server) return
    const supabase = nuxtApp.$supabase
    if (!supabase || channel) return

    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36)
    channel = supabase.channel('site-presence')

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel?.presenceState() ?? {}
        onlineCount.value = Object.keys(state).length
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && channel) {
          await channel.track({ id: sessionId, online_at: Date.now() })
        }
      })
  })

  onBeforeUnmount(() => {
    if (channel) {
      void channel.unsubscribe()
      channel = null
    }
    onlineCount.value = 0
  })

  return { onlineCount }
}
