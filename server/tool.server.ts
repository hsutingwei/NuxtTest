import crypto from 'crypto';

export function EncryptionBySHA256(oriString: string, salt: string): string {
    const hashPassword = crypto
        .createHash('sha256')
        .update(oriString + salt)
        .digest('hex');
    console.log(hashPassword);
}