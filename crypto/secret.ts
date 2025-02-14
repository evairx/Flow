/**
 * Generate a HMAC signature for the given data using the provided key
 * @param {string} key The key to use for the HMAC signature
 * @param {string} data The data to sign
 * @returns {Promise<string>} The HMAC signature
 */
export async function generate(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const dataToSign = encoder.encode(data);

    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // Sign the data
    const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        dataToSign
    );

    // Convert to hex string
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
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