import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { SDKConfig, HttpRequestConfig } from './types.js';

/**
 * HTTP Client for Oxylabs API
 */
export class OxylabsAIStudioClient {
  private config: Required<SDKConfig>;
  private http: AxiosInstance;

  constructor(config: SDKConfig) {
    this.config = {
      apiUrl: config.apiUrl || 'https://api-aistudio.oxylabs.io',
      apiKey: config.apiKey || '',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      debug: config.debug || false,
      ...config
    } as Required<SDKConfig>;
    
    // Create axios instance
    this.http = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'js-sdk'
      }
    });

    // Setup request interceptor for authentication
    this.http.interceptors.request.use(
      (config) => {
        if (this.config.apiKey) {
          config.headers!['x-api-key'] = this.config.apiKey;
        }
        
        if (this.config.debug) {
          console.log(`[DEBUG] ${config.method?.toUpperCase()} ${config.url}`);
          console.log('[DEBUG] Headers:', config.headers);
          if (config.data) {
            console.log('[DEBUG] Data:', config.data);
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Setup response interceptor for error handling
    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.config.debug) {
          console.log(`[DEBUG] Response ${response.status}:`, response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        if (this.config.debug) {
          console.error('[DEBUG] Error:', error.response?.data || error.message);
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const errorData = data as any;
      return new Error(`API Error ${status}: ${errorData.message || errorData.error || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network Error: No response from server');
    } else {
      // Something else happened
      return new Error(`Request Error: ${error.message}`);
    }
  }

  /**
   * Retry wrapper for API calls
   */
  private async withRetry<T>(fn: () => Promise<T>, attempts: number = this.config.retryAttempts): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === attempts - 1) throw error;
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        if (this.config.debug) {
          console.log(`[DEBUG] Retrying request (attempt ${i + 2}/${attempts})`);
        }
      }
    }
    
    // This should never be reached, but TypeScript requires a return
    throw new Error('Unexpected error in retry logic');
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config: HttpRequestConfig = {}): Promise<T> {
    return this.withRetry(async () => {
      const response = await this.http.get<T>(url, config);
      return response.data;
    });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data: any = {}, config: HttpRequestConfig = {}): Promise<T> {
    return this.withRetry(async () => {
      const response = await this.http.post<T>(url, data, config);
      return response.data;
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data: any = {}, config: HttpRequestConfig = {}): Promise<T> {
    return this.withRetry(async () => {
      const response = await this.http.put<T>(url, data, config);
      return response.data;
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config: HttpRequestConfig = {}): Promise<T> {
    return this.withRetry(async () => {
      const response = await this.http.delete<T>(url, config);
      return response.data;
    });
  }
} 