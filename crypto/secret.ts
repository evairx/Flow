import { createHmac } from 'node:crypto';

/**
 * Generate a HMAC signature for the given data using the provided key
 * @param {string} key The key to use for the HMAC signature
 * @param {string} data The data to sign
 * @returns {string} The HMAC signature
 */
export function generate(key: string, data: string): string {
    const hmac = createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
}

/**
 * Generate a signature for the given parameters using the provided secret key
 * @param {Record<string, string>} params The parameters to sign
 * @param {string} secretKey The secret key to use for the signature
 * @returns {Promise<string>} The generated signature
 */
export async function generateSignature(params: Record<string, string>, secretKey: string): Promise<string> {
    const sortedKeys = Object.keys(params).sort();
    const toSign = sortedKeys.map(key => `${key}=${params[key]}`).join("&");
    return generate(secretKey, toSign);
  }