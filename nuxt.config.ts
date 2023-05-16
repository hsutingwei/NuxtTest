// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@unocss/nuxt',
        '@sidebase/nuxt-auth'
    ],
    auth: {
        origin: process.env.ORIGIN,
        enableGlobalAppMiddleware: true
    }
})
