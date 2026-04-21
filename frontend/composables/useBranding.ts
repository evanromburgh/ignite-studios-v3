import type { PublicBranding } from '~/config/brandingDefaults'
import { defaultPublicBranding } from '~/config/brandingDefaults'

export type { PublicBranding } from '~/config/brandingDefaults'

function mergeBranding(
  partial: Partial<PublicBranding> | undefined | null,
): PublicBranding {
  return {
    faviconUrl: partial?.faviconUrl ?? defaultPublicBranding.faviconUrl,
    logoLightUrl: partial?.logoLightUrl ?? defaultPublicBranding.logoLightUrl,
    logoDarkUrl: partial?.logoDarkUrl ?? defaultPublicBranding.logoDarkUrl,
    seoImageUrl: partial?.seoImageUrl ?? defaultPublicBranding.seoImageUrl,
  }
}

export function useBranding(): PublicBranding {
  const config = useRuntimeConfig()
  const raw = config.public.branding as Partial<PublicBranding> | undefined
  return mergeBranding(raw)
}
