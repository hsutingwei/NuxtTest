import { auth } from 'express-openid-connect'
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: this.$config.AUTH0_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: this.$config.AUTH0_CLIENTID,
    issuerBaseURL: 'https://nuxttest-production.up.railway.app'
};

export default defineNuxtRouteMiddleware((to, from) => {
    auth(config);
    const auth = useState('auth')
    if (!auth.value.authenticated) {
        return navigateTo('/login')
    }
})