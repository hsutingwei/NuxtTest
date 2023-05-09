export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);

    // Add your account password verification logic here
    const isValid = username === 'admin' && password === 'admin';
    const response: ApiResponse = { success: isValid };
    return response;
})