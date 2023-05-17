import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
    const env_value = useRuntimeConfig();
    const auth0 = createAuth0({
        authRequired: false,
        auth0Logout: true,
        secret: env_value.AUTH0_SECRET,
        baseURL: env_value.AUTH0_DOMAIN,
        clientID: env_value.AUTH0_CLIENTID,
        issuerBaseURL: 'https://dev-tc6olcvek7d4xkgt.us.auth0.com'
    })

    if (process.client) {
        nuxtApp.vueApp.use(auth0)
    }

    addRouteMiddleware('auth', () => {
        if (process.client) {
            auth0.checkSession()
            if (!auth0.isAuthenticated.value) {
                auth0.loginWithRedirect({
                    appState: {
                        target: useRoute().path,
                    },
                })
            }
        }
    })
})