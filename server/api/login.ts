export default defineEventHandler(async (event) => {
    const body = await readBody<{ username: string, password: string }>(event);
    return body.username == 'admin' && body.password == 'admin' ? true : false;
})