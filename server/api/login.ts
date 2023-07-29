import { LoginRequest, ApiResponse } from '~/type';
import { userOP } from '../utils/userTool';
import { signJWT, verifyJWT } from '../utils/jwt'
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);
    console.log(123);
    let success = false;
    type tokenResponse = {
        access_token: string,
        refresh_token: string,
        expires_in: number,
        token_type: string,
        id_token: string
    };

    //取得API回傳的Token
    try {
        const getToken = await $fetch<tokenResponse>(`${env_value.public.AUTH0_DOMAIN}/oauth/token`, {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'password',
                username: username,
                password: password,
                scope: 'openid profile email offline_access',
                client_id: env_value.public.AUTH0_CLIENTID,
                client_secret: env_value.AUTH0_SECRET,
                audience: 'NuxtLoginAPI',
            })
        });
        success = true;
        console.log(getToken);//86400//7200

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
    } catch (error) {
        console.log(error);
    }

    return {
        success: success
    } satisfies ApiResponse;
})