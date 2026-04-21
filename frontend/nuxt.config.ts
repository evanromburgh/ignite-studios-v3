// https://nuxt.com/docs/api/configuration/nuxt-config

import { defaultPublicBranding } from './config/brandingDefaults'

const defaultSeoTitle = 'Streamline Your Unit Reservation Process'
const defaultSeoDescription =
  'Ignite Studios gives your team one portal to view available units, reserve them, and keep required reservation documents organized.'

const seoTitle = process.env.NUXT_PUBLIC_SEO_TITLE || defaultSeoTitle
const seoDescription = process.env.NUXT_PUBLIC_SEO_DESCRIPTION || defaultSeoDescription
const seoImageUrl = process.env.NUXT_PUBLIC_SEO_IMAGE_URL || defaultPublicBranding.seoImageUrl

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: 3000,
    host: 'localhost',
  },

  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],

  app: {
    head: {
      title: seoTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: seoDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: seoTitle },
        { property: 'og:description', content: seoDescription },
        { property: 'og:image', content: seoImageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: seoTitle },
        { name: 'twitter:description', content: seoDescription },
        { name: 'twitter:image', content: seoImageUrl },
        {
          name: 'format-detection',
          content: 'telephone=no, date=no, address=no, email=no',
        },
        { name: 'x-apple-disable-message-reformatting', content: 'yes' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap',
        },
      ],
      bodyAttrs: {
        class: 'antialiased',
        style: 'background:#18181B;',
      },
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      seoTitle,
      seoDescription,
      seoImageUrl,
      branding: {
        faviconUrl: process.env.NUXT_PUBLIC_BRANDING_FAVICON_URL || defaultPublicBranding.faviconUrl,
        logoLightUrl:
          process.env.NUXT_PUBLIC_BRANDING_LOGO_LIGHT_URL || defaultPublicBranding.logoLightUrl,
        logoDarkUrl:
          process.env.NUXT_PUBLIC_BRANDING_LOGO_DARK_URL || defaultPublicBranding.logoDarkUrl,
        seoImageUrl:
          process.env.NUXT_PUBLIC_BRANDING_SEO_IMAGE_URL || defaultPublicBranding.seoImageUrl,
      },
    },
  },
})
