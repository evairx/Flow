export interface Config {
    apiKey: string;
    secretKey: string;
    apiUrl: string;
}
  
export interface PaymentResponse {
    success: boolean;
    data?: any;
    error?: string;
}