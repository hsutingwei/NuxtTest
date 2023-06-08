import { getAuth0Client } from "../server/utils/authInit"

export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log(process.server)

    if(process.server) return

    const auth0Client = await getAuth0Client();
    let isAuthenticated = auth0Client.isAuthenticated();
    if (to.path === '/' && !to?.query?.code)
        return;
    if (!isAuthenticated) {
        const query = to?.query;
        if (query && query.code && query.state) {
            await auth0Client.handleRedirectCallback();
        } else {
            await auth0Client.loginWithRedirect();
        }
    } else {
        console.log('logged in ', to.path);
    }

    const router = useRoute();
    if (to.path === '/')
        to.fullPath = '/';

    navigateTo(to.path);
})