import crypto, { privateDecrypt } from 'crypto';
import { ApiResponse } from '~/type'
const env_value = useRuntimeConfig();
export const salt_global = env_value.SECRET;

export function encryptionBySHA256(oriString: string, salt: string) {
    const hashPassword = crypto
        .createHash('sha256')
        .update(oriString + salt)
        .digest('hex');
    console.log(hashPassword);
    return hashPassword;
}

