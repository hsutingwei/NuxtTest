import crypto, { privateDecrypt } from 'crypto';
import pg from 'pg'
import { ApiResponse } from '~/type'
const env_value = useRuntimeConfig();
export const salt_global = 'yves.hsuNuxtLoginProject2023';

export function EncryptionBySHA256(oriString: string, salt: string) {
    const hashPassword = crypto
        .createHash('sha256')
        .update(oriString + salt)
        .digest('hex');
    console.log(hashPassword);
    return hashPassword;
}
