import { generateSignature } from '../crypto/secret';

interface Config {
  apiKey: string;
  secretKey: string;
  apiURL: string;
}

interface PaymentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class FlowPaymentService {
  private config: Config;

  constructor(config: Config) {
    if (!config.apiKey || !config.secretKey || !config.apiURL) {
      throw new Error('Missing required configuration parameters');
    }
    this.config = config;
  }

  private isValidToken(token: string): boolean {
    return typeof token === 'string' && token.length === 40;
  }

  public async getStatus(token: string): Promise<PaymentResponse> {
    if (!token) {
      throw new Error('Payment token is required');
    }

    if (!this.isValidToken(token)) {
      throw new Error('Invalid token format');
    }

    try {
      const params: Record<string, string> = {
        apiKey: this.config.apiKey,
        token: token,
      };

      const signature = await generateSignature(params, this.config.secretKey);

      const url = new URL(`${this.config.apiURL}/payment/getStatus`);
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
      console.error('Error in getStatus:', error instanceof Error ? error.message : 'Unknown error');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}