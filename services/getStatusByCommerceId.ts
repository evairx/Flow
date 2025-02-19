import { generateSignature } from '@crypto/secret';
import { Config } from '@services/types/payments';

export const getStatusByCommerceId = async (commerceId: string, config: Config) => {
    if (!config.apiKey || !config.secretKey || !config.apiUrl) {
        throw new Error('Missing required configuration parameters');
    }

    try {
        const params: Record<string, string> = {
            apiKey: config.apiKey,
            commerceId,
        };

        const signature = await generateSignature(params, config.secretKey);

        const url = new URL(`${config.apiUrl}/payment/getStatusByCommerceId`);
        url.search = new URLSearchParams({
        ...params,
        s: signature
        }).toString();

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Accept": "application/json"
            }
        });

        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Flow API error: ${response.status} - ${errorBody}`);
        }
  
        const data = await response.json();
      
        if (!data) {
            throw new Error('Empty response received from Flow API');
        }
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}