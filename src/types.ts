// Configuration interfaces
export interface SDKConfig {
  apiUrl?: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  debug?: boolean;
}

// Status enums
export enum RunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  SUCCESS = 'success',
  FAILED = 'failed',
  ERROR = 'error'
}

export enum OutputFormat {
  MARKDOWN = 'markdown',
  JSON = 'json'
}

// API Response interfaces
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status?: string;
}

export interface RunResponse {
  run_id: string;
  id?: string;
  status: RunStatus;
  message?: string;
  error?: string;
}

export interface RunStatusResponse {
  status: RunStatus;
  message?: string;
  error?: string;
}

export interface SchemaResponse {
  openapi_schema: Record<string, any>;
}

// AI Scrape interfaces
export interface GenerateSchemaOptions {
  user_prompt: string;
}

export interface ScrapeOptions {
  url: string;
  user_prompt?: string;
  output_format?: OutputFormat | string;
  openapi_schema?: Record<string, any>;
  render_html?: boolean;
}

export interface ScrapeWithAutoSchemaOptions {
  url: string;
  user_prompt: string;
  output_format?: OutputFormat | string;
  render_html?: boolean;
}

// AI Crawl interfaces
export interface CrawlOptions {
  url: string;
  crawl_prompt: string;
  output_format?: OutputFormat | string;
  openapi_schema?: Record<string, any>;
  max_pages?: number;
  render_html?: boolean;
}

export interface CrawlWithAutoSchemaOptions {
  url: string;
  crawl_prompt: string;
  parse_prompt: string;
  output_format: OutputFormat | string;
  max_pages?: number;
  render_html?: boolean;
}

// AI Browse interfaces
export interface BrowseOptions {
  url: string;
  browse_prompt: string;
  output_format: OutputFormat | string;
  openapi_schema: Record<string, any>;
  render_html?: boolean;
}

export interface BrowseWithAutoSchemaOptions {
  url: string;
  browse_prompt: string;
  parse_prompt: string;
  output_format?: OutputFormat | string;
  render_html?: boolean;
}

// HTTP Client interfaces
export interface HttpRequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  [key: string]: any;
} 