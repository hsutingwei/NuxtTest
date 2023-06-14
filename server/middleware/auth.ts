import jwksClient from 'jwks-rsa';
import Jwt from 'jsonwebtoken'
import { tokenResponse } from '~/type'
import { error } from 'console';
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    console.log(event.node.req.url)
    if ((event.node.req.url || '').indexOf('login') > -1 || (event.node.req.url || '').indexOf('api/auth0') > -1)
        return;

    let accessToken = '';
    if (!getCookie(event, 'accessToken'))
        throw createError({ statusCode: 401, statusMessage: 'no access information' })

    //Get AccessToken
    accessToken = getCookie(event, 'accessToken') || '';
    //Decode AccessToken
    let decodeAccessToken = Jwt.decode(accessToken, { complete: true });

    //Get Public key
    let publicKey = await getPublicKey(decodeAccessToken?.header.kid || '');

    /**Access token is Verified */
    let isVerified = false;

    //Verfy access token
    try {
        Jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
        isVerified = true;
    } catch (e) {
        if (e instanceof Jwt.TokenExpiredError) {//access token is expired
            //Refresh token
            const reToken: tokenResponse = await refreshToken(getCookie(event, 'refreshToken') || '')

            // set access token in cookie
            setCookie(event, 'accessToken', reToken.access_token, {
                httpOnly: true,
                expires: new Date(Date.now() + reToken.expires_in * 1000 + 1000 * 60 * 60 * 24 * 7),
                sameSite: 'strict'
            });
            // set refresh token in cookie
            setCookie(event, 'refreshToken', reToken.refresh_token, {
                httpOnly: true,
                expires: new Date(Date.now() + 31557600),
                sameSite: 'strict'
            });
            // set id token in cookie
            setCookie(event, 'idToken', reToken.id_token, {
                httpOnly: true,
                expires: new Date(Date.now() + reToken.expires_in * 1000 + 1000 * 60 * 60 * 24 * 7),
                sameSite: 'strict'
            });

            isVerified = true;
        } else {//re-get piblic key, and try to verify the accessToken once
            publicKey = await getPublicKey(decodeAccessToken?.header.kid || '');
            try {
                Jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
                isVerified = true;
            } catch (e) {
                if (e instanceof Jwt.TokenExpiredError) {//access token is expired
                    //Refresh token
                    const reToken: tokenResponse = await refreshToken(getCookie(event, 'refreshToken') || '')

                    // set access token in cookie
                    setCookie(event, 'accessToken', reToken.access_token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + reToken.expires_in * 1000 + 1000 * 60 * 60 * 24 * 7),
                        sameSite: 'strict'
                    });
                    // set refresh token in cookie
                    setCookie(event, 'refreshToken', reToken.refresh_token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 31557600),
                        sameSite: 'strict'
                    });
                    // set id token in cookie
                    setCookie(event, 'idToken', reToken.id_token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + reToken.expires_in * 1000 + 1000 * 60 * 60 * 24 * 7),
                        sameSite: 'strict'
                    });

                    isVerified = true;
                }
            }
        }
    }

    if (isVerified) {
        console.log('ok')
        console.log(getCookie(event, 'idToken'))
        //取得API回傳的Profile
        /*const getProfile = await $fetch<any>(`${env_value.public.AUTH0_DOMAIN}/tokeninfo`, {
            method: 'post',
            body: {
                id_token: getCookie(event, 'idToken') || '',
            }
        });
        console.log(getProfile);*/
    }
    /*else
        throw createError({ statusCode: 401, statusMessage: 'no verify' })*/
})

/**
 * Get public key by kid
 * @param kid kid in access token's header
 */
async function getPublicKey(kid: string) {
    let publicKey = '';
    let tryGet = (await useStorage().getItem('PublicKey'))?.toString();
    if (tryGet != null) {
        publicKey = tryGet;
    } else {
        try {
            const client = jwksClient({
                jwksUri: env_value.public.AUTH0_DOMAIN + '/.well-known/jwks.json',
            });
            const key = await client.getSigningKey(kid);
            publicKey = key.getPublicKey();
            await useStorage().setItem('PublicKey', publicKey);
        } catch {
            createError({ statusCode: 401, statusMessage: 'no kid/PublicKey information' })
        }
    }

    return publicKey;
}

/**Refresh Token
 * @param refreshToken refreshToken in auth0's token
 */
async function refreshToken(refreshToken: string): Promise<tokenResponse> {
    //取得API回傳的Token
    try {
        const getToken = await $fetch<tokenResponse>(`${env_value.public.AUTH0_DOMAIN}/oauth/token`, {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: env_value.public.AUTH0_CLIENTID,
                client_secret: env_value.AUTH0_SECRET,
                refresh_token: refreshToken
            })
        });
        console.log(getToken)

        return {
            access_token: getToken.access_token,
            refresh_token: getToken.refresh_token,
            id_token: getToken.id_token,
            expires_in: getToken.expires_in
        }
    } catch {
        throw createError({ statusCode: 401, statusMessage: 'refresh_token is not legal' })
    }
}