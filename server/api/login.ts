import { LoginRequest, ApiResponse } from '~/type';
import { userOP } from '../utils/userTool';
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);

    const payload = {
        user_id: username,
    }
    const token = jwt.sign(payload, salt_global, { expiresIn: '1 day' });
    const decoded = jwt.verify(token, salt_global);
    console.log('=======');
    console.log(decoded);

    /*const uo = new userOP(username, password);
    const isValid = await uo.accountValid();*/
    let success = false;
    /*if (isValid) {
        const keyResponse = await uo.getLoginKey();
        console.log(keyResponse);
        if (keyResponse.success) {
            setCookie(event, 'userid', keyResponse.data.publicKey);
            success = true;
        }
    }*/

    return {
        success: success
    } satisfies ApiResponse;
})