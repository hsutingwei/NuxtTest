import { LoginRequest, ApiResponse } from '~/type'
import pg from 'pg'
import { userOP } from '../utils/userTool';

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);

    const uo = new userOP(username, password);
    const isValid = await uo.accountValid();
    if (isValid){

    }
    const response: ApiResponse = { success: isValid };
    const env_value = useRuntimeConfig();
    console.log(env_value);
    /*console.log(username);
    console.log(password);*/
    return response;
})