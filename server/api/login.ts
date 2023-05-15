import { LoginRequest, ApiResponse } from '~/type'

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