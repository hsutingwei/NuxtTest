import { auth } from 'express-openid-connect'

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'Gp6wrKBJ2CkoTAGUUhK1zv_ELJJTaDOs9BciJ9DYfmjYdPSDIxDuLEaD4WusbpEK',
    baseURL: 'http://localhost:3000',
    clientID: 'ehiYMGrwfM20Z2g4PIAgKLcg4vb96ZkJ',
    issuerBaseURL: 'https://dev-tc6olcvek7d4xkgt.us.auth0.com'
};

