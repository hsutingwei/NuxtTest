const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    console.log(query);
    type tokenResponse = {
        access_token: string,
        refresh_token: string,
        id_token: string,
        scope: string,
        expires_in: string,
        token_type: string
    }

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
    })
    console.log(getToken);
    return sendRedirect(event, '/profile');
})