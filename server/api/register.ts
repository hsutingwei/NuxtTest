import { LoginRequest, ApiResponse, PasswordValidationResult } from '~/type'
import pg from 'pg'
import crypto from 'crypto';
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

    const uo = new userOP(username, password, username, false);
    return await uo.addUserInDB();
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