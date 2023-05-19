import crypto from 'crypto';
import pg from 'pg'
import { ApiResponse } from '~/type'
const env_value = useRuntimeConfig();

export function EncryptionBySHA256(oriString: string, salt: string) {
    const hashPassword = crypto
        .createHash('sha256')
        .update(oriString + salt)
        .digest('hex');
    console.log(hashPassword);
    return hashPassword;
}

export class addUser {
    account: string;
    username: string;
    password: string;
    isOAuth: boolean;
    oAuthFrom: string;

    constructor(account, username, password, isOAuth?, oAuthFrom?) {
        this.account = account;
        this.username = username;
        this.password = password != '' ? this.codedPassword(password) : '';
        this.isOAuth = isOAuth !== undefined ? isOAuth : false;
        this.oAuthFrom = oAuthFrom !== undefined ? oAuthFrom : '';
    }

    /**加密使用者的密碼 */
    private codedPassword(password): string {
        return EncryptionBySHA256(password, 'yves.hsuNuxtLoginProject2023');
    }

    async addUserInDB(): ApiResponse<{ message: string }> {
        /*if (this.accountIsExists())
            return {
                success: false,
                data: { message: '帳號已存在' }
            } satisfies ApiResponse<{ message: string }>;

        // 建立 PostgreSQL 連線
        const client = new pg.Client(env_value.DB_CON);*/
        let success = false;
        let message = '666';
        /*try {
            await client.connect();
            // 插入新使用者
            const insertUserQuery =
                'INSERT INTO users (username, password, name, is_verified, is_oauth, oauth_provider) VALUES ($1, $2, $3, $4, $5, $6)';
            const values = [
                this.account,
                this.password,
                this.username,
                !this.isOAuth,
                this.oAuthFrom
            ];
            await client.query(insertUserQuery, values);
            success = true;
            message = '新增成功';
        } catch (error) {
            console.log(error);
            success = false;
            message = '新增失敗';
        } finally {
            client.end();
        }*/

        return {
            success: success,
            data: { message: message }
        } satisfies ApiResponse<{ message: string }>;
    }

    async accountIsExists(): boolean {
        // 建立 PostgreSQL 連線
        const client = new pg.Client(env_value.DB_CON);

        // 檢查帳號是否存在
        const existingUserQuery = 'SELECT COUNT(*) FROM users WHERE username = $1 and isOAuth = $2';
        await client.connect();
        const { rows: existingUserRows } = await client.query(existingUserQuery, [this.account, this.isOAuth]);
        const existingUserCount = parseInt(existingUserRows[0].count, 10);

        if (existingUserCount > 0) {
            console.log('帳號已存在');
            return true;
        }

        return false;
    }
}