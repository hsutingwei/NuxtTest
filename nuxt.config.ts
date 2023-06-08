// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@unocss/nuxt'
    ],
    runtimeConfig: {
        public: {
            googleClientId: process.env.GOOGLE_CLIENTID,
            AUTH0_CLIENTID: process.env.AUTH0_CLIENTID,
            AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
            REDIRECT_URL: process.env.REDIRECT_URL,
            test: process.env.AUTH0_SECRET,
        },
        AUTH0_SECRET: process.env.AUTH0_SECRET,
        DB_CON: process.env.DB_CON,
        SECRET: process.env.SECRET,
        REFRESH_SECRET: process.env.REFRESH_SECRET,
    },
    plugins: [
        '~/plugins/vue3-google-login.client.ts',
    ]
})
