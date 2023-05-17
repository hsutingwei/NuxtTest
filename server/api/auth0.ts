import { auth } from 'express-openid-connect'
const env_value = useRuntimeConfig();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: env_value.AUTH0_SECRET,
    baseURL: env_value.public.PROFILE_PAGE,
    clientID: env_value.public.AUTH0_CLIENTID,
    issuerBaseURL: env_value.public.AUTH0_DOMAIN
};

console.log(auth(config));
//export default fromNodeMiddleware(auth(config))