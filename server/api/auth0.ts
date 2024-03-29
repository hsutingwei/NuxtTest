import { tokenResponse } from '~/type'
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    //取得API回傳的Token
    const getToken = await $fetch<tokenResponse>(`${env_value.public.AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: env_value.public.AUTH0_CLIENTID,
            client_secret: env_value.AUTH0_SECRET,
            code: query.code as string,
            audience: 'NuxtLoginAPI',
            redirect_uri: env_value.public.REDIRECT_URL
        })
    });
    console.log(getToken);
    // set access token in cookie
    setCookie(event, 'accessToken', getToken.access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + getToken.expires_in * 1000 + 1000 * 60 * 60 * 24 * 7),
        sameSite: 'strict'
    });
    // set refresh token in cookie
    setCookie(event, 'refreshToken', getToken.refresh_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 31557600),
        sameSite: 'strict'
    });
    // set id token in cookie
    setCookie(event, 'idToken', getToken.id_token, {
        httpOnly: true,
        expires: new Date(Date.now() + getToken.expires_in * 1000 + 1000 * 60 * 60 * 24 * 7),
        sameSite: 'strict'
    });

    return sendRedirect(event, '/dashboard');
})