import { generateSignature } from '@crypto/secret';
import { Config, PaymentResponse } from '@services/types/payments';

export const isValidToken = (token: string): boolean => {
  return typeof token === 'string' && token.length === 40;
};

export const getStatusPayment = async (token: string, config: Config ): Promise<PaymentResponse> => {
  if (!config.apiKey || !config.secretKey || !config.apiUrl) {
    throw new Error('Missing required configuration parameters');
  }

  if (!token) {
    throw new Error('Payment token is required');
  }

  if (!isValidToken(token)) {
    throw new Error('Invalid token format');
  }

  try {
    const params: Record<string, string> = {
      apiKey: config.apiKey,
      token,
    };

    const signature = await generateSignature(params, config.secretKey);

    const url = new URL(`${config.apiUrl}/payment/getStatus`);
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
};