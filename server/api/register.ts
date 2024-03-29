import { LoginRequest, ApiResponse, PasswordValidationResult } from '~/type'
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    // 從請求中解析帳號和密碼
    const { username, password } = await readBody<LoginRequest>(event);

    // 驗證密碼是否符合規則
    const pwdValid = validatePassword(password);
    if (!pwdValid.valid) {
        return {
            success: false,
            data: { message: pwdValid.message }
        } satisfies ApiResponse<{ message: string }>;
    }

    let success = false;
    type tokenResponse = {
        _id: string,
        email_verified: boolean,
        email: string,
        username: string,
        given_name: string,
        family_name: string,
        name: string,
        nickname: string,
        picture: string,
    };

    //取得API回傳的Token
    try {
        const getToken = await $fetch<tokenResponse>(`${env_value.public.AUTH0_DOMAIN}/dbconnections/signup`, {
            method: 'POST',
            body: {
                client_id: env_value.public.AUTH0_CLIENTID,
                email: username,
                password: password,
                connection: 'Username-Password-Authentication',
                username: username,
            }
        });
        console.log(getToken);
        success = true;
    } catch (error) {
        console.log(error);
    }

    return {
        success: success,
        data: { message: '' }
    } satisfies ApiResponse<{ message: string }>;
})

function validatePassword(password: string): PasswordValidationResult {
    if (password.length < 8) {
        return {
            valid: false,
            message: 'Password should contain at least 8 characters.'
        };
    }
    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one lowercase character.'
        };
    }
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one uppercase character.'
        };
    }
    if (!/\d/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one digit character.'
        };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one special character.'
        };
    }
    return { valid: true, message: '' };
}