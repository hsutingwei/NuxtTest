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
            DB_CON: process.env.DB_CON
        }
    }
})
