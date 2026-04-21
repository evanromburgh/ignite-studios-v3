/** Default branding URLs (Supabase Storage, `assets` bucket / `branding/`). Override via NUXT_PUBLIC_BRANDING_* at deploy time. */
export interface PublicBranding {
  faviconUrl: string
  logoLightUrl: string
  logoDarkUrl: string
  seoImageUrl: string
}

export const defaultPublicBranding: PublicBranding = {
  faviconUrl:
    'https://bhmgvodqmdwnwntffvsd.supabase.co/storage/v1/object/public/assets/branding/favicon.png',
  logoLightUrl:
    'https://bhmgvodqmdwnwntffvsd.supabase.co/storage/v1/object/public/assets/branding/logo_light.svg',
  logoDarkUrl:
    'https://bhmgvodqmdwnwntffvsd.supabase.co/storage/v1/object/public/assets/branding/logo_dark.svg',
  seoImageUrl:
    'https://bhmgvodqmdwnwntffvsd.supabase.co/storage/v1/object/public/assets/images/seo_image.webp',
}
