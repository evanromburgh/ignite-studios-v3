import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Unit } from '~/types'

export function mapUnitRow(row: Record<string, unknown>): Unit {
  const lockRaw = row.lock_expires_at
  let lockExpiresAt: number | undefined
  if (lockRaw != null && lockRaw !== '') {
    lockExpiresAt = new Date(String(lockRaw)).getTime()
  }
  const viewersRaw = row.viewers
  const viewers =
    viewersRaw && typeof viewersRaw === 'object' && !Array.isArray(viewersRaw)
      ? (viewersRaw as Record<string, number>)
      : {}

  return {
    id: String(row.id),
    unitNumber: String(row.unit_number),
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    parking: Number(row.parking),
    sizeSqm: Number(row.size_sqm),
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    status: row.status as Unit['status'],
    unitType: String(row.unit_type),
    floor: row.floor != null ? String(row.floor) : null,
    direction: row.direction != null ? String(row.direction) : null,
    imageUrl: row.image_url != null ? String(row.image_url) : '',
    imageUrl2: row.image_url_2 != null ? String(row.image_url_2) : null,
    imageUrl3: row.image_url_3 != null ? String(row.image_url_3) : null,
    floorplanUrl: row.floorplan_url != null ? String(row.floorplan_url) : null,
    viewers,
    lockExpiresAt,
    lockedBy: row.locked_by != null ? String(row.locked_by) : undefined,
  }
}

const units = ref<Unit[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let channel: RealtimeChannel | null = null

export function useCatalog() {
  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase
  const { user } = useAuth()

  async function fetchUnits() {
    if (!supabase) {
      loading.value = false
      error.value = 'Supabase is not configured.'
      return
    }
    loading.value = true
    error.value = null
    const { data, error: qErr } = await supabase
      .from('units')
      .select('*')
      .order('unit_number', { ascending: true })

    if (qErr) {
      error.value = qErr.message
      units.value = []
    } else {
      units.value = (data ?? []).map((row) => mapUnitRow(row as Record<string, unknown>))
    }
    loading.value = false
  }

  function applyRealtimePayload(newRow: Record<string, unknown>) {
    const u = mapUnitRow(newRow)
    const i = units.value.findIndex((x) => x.id === u.id)
    if (i >= 0) units.value.splice(i, 1, u)
    else units.value.push(u)
  }

  function subscribe() {
    if (!supabase || import.meta.server) return
    if (channel) return

    channel = supabase
      .channel('catalog-units')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'units' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            applyRealtimePayload(payload.new as Record<string, unknown>)
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            applyRealtimePayload(payload.new as Record<string, unknown>)
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const id = (payload.old as { id?: string }).id
            if (id) units.value = units.value.filter((x) => x.id !== id)
          }
        },
      )
      .subscribe()
  }

  function unsubscribe() {
    if (channel && supabase) {
      void supabase.removeChannel(channel)
      channel = null
    }
  }

  watch(
    () => user.value?.id,
    (id) => {
      if (!id) {
        unsubscribe()
        units.value = []
        error.value = null
        loading.value = false
        return
      }
      void fetchUnits()
      subscribe()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    unsubscribe()
  })

  return {
    units,
    loading,
    error,
    refresh: fetchUnits,
  }
}
