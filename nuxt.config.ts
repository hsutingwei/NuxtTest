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
            DB_CON: process.env.DB_CON,
            GOOGLE_CLIENTID: '83643837435-4d6323gjrqt0gs7fivomh2n8f858o4gs.apps.googleusercontent.com',
        }
    },
    plugins: [
        '~/plugins/vue3-google-login.client.ts',
    ]
})
