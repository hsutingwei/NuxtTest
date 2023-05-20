import pg from 'pg'
import { ApiResponse } from '~/type'
import { encryptionBySHA256, salt_global } from './encryptionTool';
const env_value = useRuntimeConfig();

/**User相關操作的class */
export class userOP {
    account: string;
    username: string;
    password: string;
    isOAuth: boolean;
    oAuthFrom: string;

    /**初始化使用者資訊
     * @param account 使用者帳號
     * @param username 使用者名稱
     * @param password 使用者密碼
     * @param isOAuth 使用者是否來自OAuth
     * @param oAuthFrom OAuth來源
     */
    constructor(account: string, password: string, username?: string, isOAuth?: boolean, oAuthFrom?: string) {
        this.account = account;
        this.username = username !== undefined ? username : '';
        this.password = password != '' ? this.codedPassword(password) : '';
        this.isOAuth = isOAuth !== undefined ? isOAuth : false;
        this.oAuthFrom = oAuthFrom !== undefined ? oAuthFrom : '';
    }

    /**加密使用者的密碼 */
    private codedPassword(password: string): string {
        return encryptionBySHA256(password, salt_global);
    }

    /**新增帳號至User表 */
    async addUserInDB(): Promise<ApiResponse<{ message: string; }>> {
        if (await this.accountIsExists())
            return {
                success: false,
                data: { message: '帳號已存在' }
            } satisfies ApiResponse<{ message: string }>;
        // 建立 PostgreSQL 連線
        const client = new pg.Client(env_value.DB_CON);
        let success = false;
        let message = '';
        try {
            await client.connect();
            // 插入新使用者
            const insertUserQuery =
                'INSERT INTO users (username, password, name, is_verified, is_oauth, oauth_provider) VALUES ($1, $2, $3, $4, $5, $6)';
            const values = [
                this.account,
                this.password,
                this.username,
                !this.isOAuth,
                this.isOAuth,
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
        }

        return {
            success: success,
            data: { message: message }
        } satisfies ApiResponse<{ message: string }>;
    }

    /**檢查帳號是否已存在 */
    async accountIsExists(): Promise<boolean> {
        // 建立 PostgreSQL 連線
        const client = new pg.Client(env_value.DB_CON);
        let success = false;

        try {
            // 檢查帳號是否存在
            const existingUserQuery = 'SELECT COUNT(*) FROM users WHERE username = $1 and is_OAuth = $2';
            await client.connect();
            const { rows: existingUserRows } = await client.query(existingUserQuery, [this.account, this.isOAuth]);
            const existingUserCount = parseInt(existingUserRows[0].count, 10);

            if (existingUserCount > 0) {
                console.log('帳號已存在');
                success = true;
            }
        } catch (error) {
            console.log(error);
        } finally {
            client.end();
        }

        return success;
    }

    /**檢查帳號密碼是否合法 */
    async accountValid(): Promise<boolean> {
        // 建立 PostgreSQL 連線
        const client = new pg.Client(env_value.DB_CON);
        let success = false;

        try {
            // 檢查帳號是否存在
            const existingUserQuery = 'SELECT COUNT(*) FROM users WHERE username = $1 and password = $2 and is_OAuth = false';
            await client.connect();
            console.log(this.password);
            const { rows: existingUserRows } = await client.query(existingUserQuery, [this.account, this.password]);
            const existingUserCount = parseInt(existingUserRows[0].count, 10);

            if (existingUserCount > 0) {
                console.log('帳號合法');
                success = true;
            }
            else
                console.log('帳號不合法');
        } catch (error) {
            console.log(error);
        } finally {
            client.end();
        }

        return success;
    }

    /**取得使用者公鑰私鑰，並將公司鑰存入Session DB */
    async getLoginKey() {
        const now = new Date();
        const nowStr = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        const publicKey = encryptionBySHA256(this.account, nowStr);
        const privateKey = encryptionBySHA256(publicKey, salt_global);

        // 建立 PostgreSQL 連線
        const client = new pg.Client(env_value.DB_CON);
        let success = false;
        try {
            await client.connect();
            // 插入Session
            const insertUserQuery =
                'INSERT INTO usersessions (user_id, login_timestamp, last_activity_timestamp, publickey, privatekey, session_token)'
                + '(select id, to_date($4, \'YYYY/MM/DD\'), to_date($4, \'YYYY/MM/DD\'), $5, $6, \'\' from users where username = $1 and password = $2 and is_verified = true and is_oauth = $3)';
            const values = [
                this.account,
                this.password,
                this.isOAuth,
                nowStr,
                publicKey,
                privateKey
            ];
            await client.query(insertUserQuery, values);
            success = true;
        } catch (error) {
            console.log(error);
        } finally {
            client.end();
        }

        return {
            success: success,
            data: {
                publicKey: publicKey,
                privateKey: privateKey
            }
        } satisfies ApiResponse<{
            publicKey: string,
            privateKey: string
        }>;
    }

    /**公鑰是否合法
     * @param publicKey 使用者公鑰
     */
    async keyValid(publicKey: string) {
        const privateKey = encryptionBySHA256(publicKey, salt_global);

        // 建立 PostgreSQL 連線
        const client = new pg.Client(env_value.DB_CON);
        let success = false;

        try {
            // 檢查帳號是否存在
            const existingUserQuery = 'SELECT COUNT(*) FROM usersessions a left join users b on a.user_id = b.id WHERE b.username = $1 and a.publickey = $2 and a.privatekey = $3';
            await client.connect();
            const { rows: existingUserRows } = await client.query(existingUserQuery, [this.account, publicKey, privateKey]);
            const existingUserCount = parseInt(existingUserRows[0].count, 10);

            if (existingUserCount > 0) {
                console.log('公鑰合法');
                success = true;
            }
            else
                console.log('公鑰不合法');
        } catch (error) {
            console.log(error);
        } finally {
            client.end();
        }

        return success;
    }
}
