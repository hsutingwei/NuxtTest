import { LoginRequest, ApiResponse } from '~/type';
import { userOP } from '../utils/userTool';
import { signJWT, verifyJWT } from '../utils/jwt'
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);
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
        console.log(getToken.refresh_token)
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


    /*const uo = new userOP(username, password);
    const isValid = await uo.accountValid();
    let success = false;
    if (isValid) {
        const keyResponse = await uo.getLoginKey();
        console.log(keyResponse);
        if (keyResponse.success) {
            setCookie(event, 'userid', keyResponse.data.publicKey);
            success = true;

            // create access token
            const accessToken = await signJWT(
                {
                    user_id: username,
                    name: username,
                    sessionId: keyResponse.data.publicKey
                },
                '5s'
            );
            const refreshToken = await signJWT({ sessionId: keyResponse.data.publicKey }, '1y');

            // set access token in cookie
            setCookie(event, 'accessToken', accessToken, {
                maxAge: 300000,
                httpOnly: true
            });
            setCookie(event, 'refreshToken', refreshToken, {
                maxAge: 3.154e10,
                httpOnly: true
            });
        }
    }*/

    return {
        success: success
    } satisfies ApiResponse;
})