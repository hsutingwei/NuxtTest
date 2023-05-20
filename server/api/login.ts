import { LoginRequest, ApiResponse } from '~/type'
import pg from 'pg'
import { userOP } from '../utils/userTool';

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
        }
    }

    return {
        success: success
    } satisfies ApiResponse;
})