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
  JSON = 'json',
  CSV = 'csv',
  SCREENSHOT = 'screenshot',
  HTML = 'html',
  TOON = "toon"
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
  output_format?: OutputFormat | string;
  schema?: Record<string, any>;
  render_javascript?: boolean | "auto";
  geo_location?: string;
  user_agent?: string;
}

export interface ScrapeWithAutoSchemaOptions {
  url: string;
  parse_prompt: string;
  output_format?: OutputFormat | string;
  render_javascript?: boolean | "auto";
  geo_location?: string;
  user_agent?: string;
}

// AI Crawl interfaces
export interface CrawlOptions {
  url: string;
  user_prompt: string;
  output_format?: OutputFormat | string;
  schema?: Record<string, any>;
  render_javascript?: boolean;
  return_sources_limit?: number;
  geo_location?: string;
  max_credits?: number | null;
}

export interface CrawlWithAutoSchemaOptions {
  url: string;
  user_prompt: string;
  parse_prompt: string;
  output_format: OutputFormat | string;
  schema?: Record<string, any>;
  render_javascript?: boolean;
  return_sources_limit?: number;
  geo_location?: string;
  max_credits?: number | null;
}

// AI Browse interfaces
export interface BrowseOptions {
  url: string;
  user_prompt: string;
  output_format: OutputFormat | string;
  schema?: Record<string, any>;
  geo_location?: string;
}

export interface BrowseWithAutoSchemaOptions {
  url: string;
  user_prompt: string;
  parse_prompt: string;
  output_format?: OutputFormat | string;
  render_javascript?: boolean;
  geo_location?: string;
}

// HTTP Client interfaces
export interface HttpRequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  [key: string]: any;
} 

// AI Search interfaces
export interface SearchOptions {
  query: string;
  limit?: number;
  render_javascript?: boolean;
  return_content?: boolean;
  geo_location?: string;
}

export interface SearchResult {
  url: string;
  title: string;
  description: string;
  content?: string | null;
}

export interface SearchRunDataResponse {
  status: 'processing' | 'completed' | 'failed';
  message?: string | null;
  data?: SearchResult[] | null;
}

export interface AiSearchRun {
  run_id: string;
  message: string | null;
  data: SearchResult[] | null;
}

export interface SearchInstantResponse {
  run_id: string;
  data: SearchResult[] | null;
  status: string;
}

export interface MapOptions {
  url: string;
  search_keywords?: string[];
  user_prompt?: string | null;
  limit?: number;
  geo_location?: string | null;
  render_javascript?: boolean;
  max_crawl_depth?: number;
  include_sitemap?: boolean;
  allow_subdomains?: boolean;
  allow_external_domains?: boolean;
  max_credits?: number | null;
}
