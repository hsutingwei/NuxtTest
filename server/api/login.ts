import { LoginRequest, ApiResponse } from '~/type';
import { userOP } from '../utils/userTool';
import { signJWT, verifyJWT } from '../utils/jwt'

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);
    const uo = new userOP(username, password);
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
    }

    return {
        success: success
    } satisfies ApiResponse;
})