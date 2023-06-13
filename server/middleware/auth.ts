import jwksClient from 'jwks-rsa';
import Jwt from 'jsonwebtoken'
import { error } from 'console';
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    if ((event.node.req.url || '').indexOf('login') > -1)
        return;

    let accessToken = '';
    if (!getCookie(event, 'accessToken'))
        throw createError({ statusCode: 401, statusMessage: 'no access information' })

    //Get AccessToken
    accessToken = getCookie(event, 'accessToken') || '';
    //Decode AccessToken
    let decodeAccessToken = Jwt.decode(accessToken, { complete: true });

    //Get Public key
    let publicKey = '';
    if (await useStorage().getItem('PublicKey')) {
        publicKey = (await useStorage().getItem('PublicKey'))?.toString() || '';
    } else {
        publicKey = await getPublicKey(decodeAccessToken?.header.kid || '')
        await useStorage().setItem('PublicKey', publicKey);
    }
    if (publicKey == '')
        throw createError({ statusCode: 401, statusMessage: 'no kid/PublicKey information' })

    /**Access token is Verified */
    let isVerified = false;

    //Verfy access token
    try {
        Jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
        isVerified = true;
    } catch (e) {
        if (e instanceof Jwt.TokenExpiredError) {//access token is expired
            type tokenResponse = {
                access_token: string,
                refresh_token: string,
                id_token: string,
                scope: string,
                expires_in: number,
                token_type: string
            };

            //取得API回傳的Token
            const getToken = await $fetch<tokenResponse>(`${env_value.public.AUTH0_DOMAIN}/oauth/token`, {
                method: 'POST',
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: env_value.public.AUTH0_CLIENTID,
                    client_secret: env_value.AUTH0_SECRET,
                    refresh_token: getCookie(event, 'refreshToken') || ''
                })
            });

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

            isVerified = true;
        } else {//re-get piblic key
            publicKey = await getPublicKey(decodeAccessToken?.header.kid || '')
            await useStorage().setItem('PublicKey', publicKey);
            if (publicKey == '')
                throw createError({ statusCode: 401, statusMessage: 'no kid/PublicKey information' })

            try {
                Jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
                isVerified = true;
            } catch { }
        }
    }

    if (isVerified) {
        //取得API回傳的Profile
        const getProfile = await $fetch<any>(`${env_value.public.AUTH0_DOMAIN}/userinfo`, {
            method: 'get'
        });
        console.log(getProfile);
    }
})

/**
 * Get public key by kid
 * @param kid kid in access token's header
 */
async function getPublicKey(kid: string) {
    let publicKey = '';
    try {
        const client = jwksClient({
            jwksUri: env_value.public.AUTH0_DOMAIN + '/.well-known/jwks.json',
        });
        const key = await client.getSigningKey(kid);
        publicKey = key.getPublicKey();
    } catch { }

    return publicKey;
}