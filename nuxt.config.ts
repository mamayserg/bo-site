import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    oktaClientId: process.env.AUTH_OKTA_CLIENT_ID,
    oktaClientSecret: process.env.AUTH_OKTA_CLIENT_SECRET,
    oktaIssuer: process.env.AUTH_OKTA_ISSUER,
    public: {
      tenantName: process.env.TENANT_NAME,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  // nitro: {
  //   preset: 'node-server',

  // },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@primevue/nuxt-module",
    // '@sidebase/nuxt-auth',
    "@nuxt/icon",
  ],
  i18n: {
    vueI18n: "./i18n.config.ts",
    defaultLocale: "fr",
  },
  css: [
    "primeicons/primeicons.css",
    "~/assets/main.css",
    "~/assets/tokens.css",
  ],
  primevue: {
    options: {
      theme: "none",
    },
    // components: {
    //   include: ["DataTable", "Column"],
    // },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  // auth: {
  //   isEnabled: true,
  //   baseURL: process.env.AUTH_ORIGIN,
  //   // globalAppMiddleware: process.env.NUXT_ENV_TEST !== 'true',
  //   provider: {
  //     type: 'authjs',
  //     trustHost: false,
  //     defaultProvider: 'okta',
  //     addDefaultCallbackUrl: true
  //   },
  // },
  // ssr: true,
  devServer: {
    port: 8080,
  },
});
