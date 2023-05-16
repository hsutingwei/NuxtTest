import { LoginRequest, ApiResponse } from '~/type'
import pg from 'pg'

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody<LoginRequest>(event);
    const client = new pg.Client(process.env.DB_CON);
    await client.connect()
    await client.query('select * from test;', (err, res) => {
        //console.log(err ? err.stack : res.rows)
        client.end()
    })

    return '';
})