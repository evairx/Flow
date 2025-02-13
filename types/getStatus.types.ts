/**
 * Configuration interface for payment API credentials and endpoint
 * @interface Config
 * @description Contains the necessary authentication and configuration parameters for the payment API
 */
export interface Config {
    /** 
     * API key for authentication
     * @type {string}
     * @required
     */
    apiKey: string;

    /** 
     * Secret key for secure API communication
     * @type {string}
     * @required
     */
    secretKey: string;

    /** 
     * Base URL for the payment API endpoint
     * @type {string}
     * @required
     * @example "https://api.payment.com/v1"
     */
    apiUrl: string;
}
  
/**
 * Standard response format for payment operations
 * @interface PaymentResponse
 * @description Represents the structure of the API response for payment-related operations
 */
export interface PaymentResponse {
    /** 
     * Indicates if the operation was successful
     * @type {boolean}
     */
    success: boolean;

    /** 
     * Optional response data when operation is successful
     * @type {any}
     * @optional
     */
    data?: any;

    /** 
     * Error message when operation fails
     * @type {string}
     * @optional
     */
    error?: string;
}