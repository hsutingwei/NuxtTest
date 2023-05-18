import { LoginRequest, ApiResponse } from '~/type'
import pg from 'pg'

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);

    const isValid = username === 'admin' && password === 'admin';
    const response: ApiResponse = { success: isValid };
    const env_value = useRuntimeConfig();
    console.log(env_value);
    /*console.log(username);
    console.log(password);*/
    return response;
})

function accountIsValid(username: string, password: string) {

}