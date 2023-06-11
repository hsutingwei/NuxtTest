import jwksClient from 'jwks-rsa';
import Jwt from 'jsonwebtoken'
import { error } from 'console';
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    //event.

    let accessToken = '';
    if (!getCookie(event, 'accessToken'))
        throw createError({ statusCode: 401, statusMessage: 'no access information' })

    //Get AccessToken
    accessToken = getCookie(event, 'accessToken') || '';
    //Decode AccessToken
    let decodeAccessToken = Jwt.decode(accessToken, { complete: true });

    //Get Public key
    let PublicKey = '';
    if (await useStorage().getItem('PublicKey')) {
        PublicKey = (await useStorage().getItem('PublicKey'))?.toString() || '';
    } else {
        try {
            const client = jwksClient({
                jwksUri: env_value.public.AUTH0_DOMAIN + '/.well-known/jwks.json',
            });
            //Get kid
            const kid = decodeAccessToken?.header.kid;
            const key = await client.getSigningKey(kid);
            PublicKey = key.getPublicKey();
            await useStorage().setItem('PublicKey', PublicKey);
        } catch {
            throw createError({ statusCode: 401, statusMessage: 'no kid/PublicKey information' })
        }
    }

    try {
        Jwt.verify(accessToken, PublicKey, { algorithms: ['RS256'] });
    } catch (e) {
        if (e instanceof Jwt.TokenExpiredError) {//access token is expired
            type tokenResponse = {
                access_token: string,
                refresh_token: string,
                id_token: string,
                scope: string,
                expires_in: string,
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

            console.log(getToken);
        } else {//re-get piblic key

        }
    }
})