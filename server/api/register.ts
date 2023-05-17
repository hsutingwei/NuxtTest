import { LoginRequest, ApiResponse } from '~/type'
import pg from 'pg'
import crypto from 'crypto';
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    // 從請求中解析帳號和密碼
    const { username, password } = await readBody<LoginRequest>(event);

    // 初始化回應物件
    let response: ApiResponse<{ message: string }> = {
        success: false,
        data: { message: '' }
    };

    // 驗證密碼是否符合規則
    const pwdValid = validatePassword(password);
    if (!pwdValid.valid) {
        response.success = false;
        response.data.message = pwdValid.message;
        return response;
    }

    // 建立 PostgreSQL 連線
    //const client = new pg.Client(env_value.DB_CON);
    try {
        // 檢查帳號是否存在
        const existingUserQuery = 'SELECT COUNT(*) FROM users WHERE username = $1';
        /*const { rows: existingUserRows } = await client.query(existingUserQuery, [username]);
        const existingUserCount = parseInt(existingUserRows[0].count, 10);

        if (existingUserCount > 0) {
            response.success = false;
            response.data.message = '帳號已存在';
            console.log('帳號已存在');
            return response;
        }*/

        // 加密和加鹽密碼
        const salt = 'yves.hsu2023';
        const hashedPassword = crypto
            .createHash('sha256')
            .update(password + salt)
            .digest('hex');
        console.log(hashedPassword);

        // 插入新使用者
        /*const insertUserQuery =
            'INSERT INTO users (username, password, name) VALUES ($1, $2, $3)';
        const values = [
            username,
            hashedPassword,
            username,
        ];
        await client.query(insertUserQuery, values);*/
        response.success = true;
        response.data.message = '新增成功';
    } catch (error) {
        console.log(error);
        response.success = false;
        response.data.message = '新增失敗';
    } finally {
        //client.release();
    }

    return response;
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