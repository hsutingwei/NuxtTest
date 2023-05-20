import jwtDecode from "jwt-decode";
import { userOP } from "../utils/userTool";
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
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
            grant_type: 'authorization_code',
            client_id: env_value.public.AUTH0_CLIENTID,
            client_secret: env_value.AUTH0_SECRET,
            code: query.code as string,
            audience: 'NuxtLoginAPI',
            redirect_uri: env_value.public.REDIRECT_URL
        })
    });
    //console.log(getToken);
    let tokenValid = false;
    if (getToken != null && getToken.access_token != null) {
        //嘗試解碼
        try {
            const decoded = jwtDecode(getToken.id_token);
            tokenValid = true;
        }
        catch (error) {
            console.log(error);
        }

        if (tokenValid) {
            setCookie(event, 'id_token', getToken.id_token);
            //let id_token = getCookie(event, 'id_token') || '';
            const decoded: any = jwtDecode(getToken.id_token);
            //console.log(decoded);

            const uo = new userOP(decoded.sub, decoded.name, '', true, decoded.sub.indexOf('google') == 0 ? 'google' : 'facebook');
            console.log((await uo.addUserInDB()).data?.message);

            return sendRedirect(event, '/dashboard');
        }
    }

    return sendRedirect(event, '/login');
})