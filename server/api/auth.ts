import { auth } from 'express-openid-connect'
const env_value = useRuntimeConfig();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: env_value.public.AUTH0_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: env_value.public.AUTH0_CLIENTID,
    issuerBaseURL: 'https://nuxttest-production.up.railway.app'
};

//console.log(auth(config));
export default fromNodeMiddleware(auth(config))