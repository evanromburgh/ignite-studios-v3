/**
 * Placeholder until browse/realtime presence ships; keeps layout chrome rendering without backend.
 */
export function useGlobalPresence() {
  const onlineCount = ref(0)
  return { onlineCount }
}
