import { LoginRequest, ApiResponse } from '~/type'
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const id_token = getCookie(event, 'idToken')
    const logout_link = env_value.public.AUTH0_DOMAIN + '/oidc/logout?post_logout_redirect_uri=' + env_value.public.AUTH0_LOGOUT
        + '&id_token_hint=' + id_token

    try {
        // 註銷Auth0 token
        const response = await $fetch(logout_link, { method: 'get' });
        // Delete cookie
        deleteCookie(event, 'accessToken')
        deleteCookie(event, 'refreshToken')
        deleteCookie(event, 'refreshToken')

        return {
            success: true,
            data: { url: env_value.public.AUTH0_LOGOUT }
        } satisfies ApiResponse<{ url: string }>;
    } catch (error) {
        console.log(error);
        throw createError({ statusCode: 401, statusMessage: 'Logout error' })
    }
})