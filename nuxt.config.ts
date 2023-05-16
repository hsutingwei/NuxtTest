// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@unocss/nuxt'
    ],
    runtimeConfig: {
        public: {
            AUTH0_CLIENTID: process.env.AUTH0_CLIENTID,
            AUTH0_SECRET: process.env.AUTH0_SECRET,
            AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
            DB_CON: process.env.DB_CON,
            googleClientId: process.env.GOOGLE_CLIENTID,
        }
    },
    plugins: [
        '~/plugins/vue3-google-login.client.ts',
        '~/plugins/auth0.client.ts'
    ]
})
