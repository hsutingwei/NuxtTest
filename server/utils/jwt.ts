import jwt from 'jsonwebtoken';
import { ApiResponse } from '~/type'

const env_value = useRuntimeConfig();
const privateKey = 'MIICWwIBAAKBgHgnvr7O2tiApjJfid1orFnIGm6980fZp+Lpbjo+NC/0whMFga2B';
const publicKey = '80fZp+Lpbjo+NC/0whMFga2Biw5b1G2Q/B2u0tpO1Fs/E8z7Lv1nYfr5jx2S8x6B';
/**sign jwt */
export async function signJWT(payload: object, expiresIn: string | number) {
    return await jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn });
}

/**verify jwt */
export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            success: true,
            data: {
                payload: decoded,
                expired: false
            }
        } satisfies ApiResponse<{ payload?: string | jwt.JwtPayload, expired: boolean }>;
    } catch (error) {
        return {
            success: false,
            data: {
                payload: undefined,
                expired: true
            }
        } satisfies ApiResponse<{ payload?: string | jwt.JwtPayload, expired: boolean }>;
    }
}