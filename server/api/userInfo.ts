import { ApiResponse } from '~/type'
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {


    const isValid = username === 'admin' && password === 'admin';
    const response: ApiResponse = { success: isValid };
    console.log(env_value);
    /*console.log(username);
    console.log(password);*/
    return response;
})

// 從資料庫取得使用者資訊並進行組合
async function getUsersWithInfoFromDatabase() {
    // 在此撰寫資料庫查詢邏輯
    const users = await fetchUsersFromDatabase();
    const userSessions = await fetchUserSessionsFromDatabase();
    const userLogins = await fetchUserLoginsFromDatabase();

    // 進行資料組合
    const usersWithInfo = users.map((user) => {
        const { id, username, name, is_oauth } = user;
        const signUpTimestamp = user.createdAt;
        const loginCount = userLogins.filter((login) => login.user_id === id).length;
        const lastSessionTimestamp = getLastSessionTimestamp(userSessions, id);

        return {
            id,
            username,
            name,
            is_oauth,
            signUpTimestamp,
            loginCount,
            lastSessionTimestamp,
        };
    });

    return usersWithInfo;
}

// 從資料庫取得使用者資料
async function fetchUsersFromDatabase(username: string) {
    const users = await db.query('SELECT * FROM Users');
    const client = new pg.Client(env_value.DB_CON);
    try {
        const usersQuery = 'SELECT COUNT(*) FROM UserLogins WHERE username = $1';
        /*const { rows: existingUserRows } = await client.query(existingUserQuery, [username]);
        const existingUserCount = parseInt(existingUserRows[0].count, 10);

        */

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
    return users;
}

// 從資料庫取得使用者會話資料
async function fetchUserSessionsFromDatabase() {
    // 在此撰寫資料庫查詢邏輯
    // 使用您的資料庫程式庫或ORM來執行查詢
    // 這裡只是一個示例，請根據您的實際情況進行調整
    const userSessions = '';//await db.query('SELECT * FROM UserSessions');
    return userSessions;
}

// 從資料庫取得使用者登入資料
async function fetchUserLoginsFromDatabase() {
    // 在此撰寫資料庫查詢邏輯
    // 使用您的資料庫程式庫或ORM來執行查詢
    // 這裡只是一個示例，請根據您的實際情況進行調整
    const userLogins = '';//await db.query('SELECT * FROM UserLogins');
    return userLogins;
}

// 取得使用者最後一個會話的時間戳記
function getLastSessionTimestamp(userSessions, userId) {
    const sessions = userSessions.filter((session) => session.user_id === userId);
    const lastSession = sessions[sessions.length - 1];
    return lastSession ? lastSession.last_activity_timestamp : null;
}