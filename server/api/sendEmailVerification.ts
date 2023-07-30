import { ApiResponse } from '~/type';
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const userInfo = event.context.userInfo
    if (!userInfo)
        throw createError({ statusCode: 401, statusMessage: 'no user info.' })
    type responseType = {
        type: string,
        status: string,
        created_at: string,
        id: string
    }

    try {
        const reponse = await $fetch<responseType>('https://dev-tc6olcvek7d4xkgt.us.auth0.com/api/v2/jobs/verification-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + env_value.EMAIL_VERFY_API
            },
            body: {
                "user_id": userInfo.uInfo.sub,
                "client_id": env_value.public.AUTH0_CLIENTID,
                "identity": {
                    "user_id": userInfo.uInfo.sub.substring(6),
                    "provider": "auth0"
                }
            }
        });

        console.log(reponse)
        if (reponse.status == 'pending') {
            return {
                success: true,
                data: { message: 'The verification letter has been mailed.' }
            } satisfies ApiResponse<{ message: string }>;
        }
    } catch (error) {
        console.log('mail error')
        console.log(error)
        //throw createError({ statusCode: 401, statusMessage: 'no user info.' })
    }
})