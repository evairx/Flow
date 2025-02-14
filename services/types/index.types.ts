/**
 * @interface FlowConfig
 * @description Contains the necessary authentication and configuration parameters for the payment API
 */
export interface FlowConfig {
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
     */
    apiUrl: string;
}
  
export interface FlowConstructorParams {
    apiKey?: string;
    secretKey?: string;
    apiUrl?: string;
}