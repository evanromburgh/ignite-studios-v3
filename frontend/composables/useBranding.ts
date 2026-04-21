export interface PublicBranding {
  faviconUrl: string
  logoLightUrl: string
  logoDarkUrl: string
  seoImageUrl: string
}

export function useBranding() {
  const config = useRuntimeConfig()
  const branding = config.public.branding as PublicBranding
  return {
    faviconUrl: branding.faviconUrl,
    logoLightUrl: branding.logoLightUrl,
    logoDarkUrl: branding.logoDarkUrl,
    seoImageUrl: branding.seoImageUrl,
  }
}
