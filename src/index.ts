import * as dotenv from 'dotenv';
import { OxylabsAIStudioClient } from './client.js';
import { AiBrowseService } from './services/aiBrowse.js';
import { AiCrawlService } from './services/aiCrawl.js';
import { AiScrapeService } from './services/aiScrape.js';
import { AiSearchService } from './services/aiSearch.js';
import { SDKConfig } from './types.js';
import { MissingApiKeyError, MissingApiUrlError } from './errors.js';

// Load environment variables
dotenv.config();

/**
 * Main Oxylabs SDK class
 */
export class OxylabsAIStudioSDK {
  public readonly config: Required<SDKConfig>;
  public readonly client: OxylabsAIStudioClient;
  public readonly aiScrape: AiScrapeService;
  public readonly aiCrawl: AiCrawlService;
  public readonly aiBrowse: AiBrowseService;
  public readonly aiSearch: AiSearchService;
  constructor(config: SDKConfig = {}) {
    const apiUrl = config.apiUrl || process.env.OXYLABS_AI_STUDIO_API_URL || '';
    const apiKey = config.apiKey || process.env.OXYLABS_AI_STUDIO_API_KEY || '';

    if (!apiUrl) {
      throw new MissingApiUrlError();
    }

    if (!apiKey) {
      throw new MissingApiKeyError();
    }

    this.config = {
      apiUrl,
      apiKey,
      timeout: config.timeout || Number(process.env.TIMEOUT) || 30000,
      retryAttempts: config.retryAttempts || Number(process.env.RETRY_ATTEMPTS) || 3,
      debug: config.debug || process.env.DEBUG === 'true',
      ...config
    } as Required<SDKConfig>;

    // Initialize client
    this.client = new OxylabsAIStudioClient(this.config);

    // Initialize services
    this.aiScrape = new AiScrapeService(this.client);
    this.aiCrawl = new AiCrawlService(this.client);
    this.aiBrowse = new AiBrowseService(this.client);
    this.aiSearch = new AiSearchService(this.client);
  }

  /**
   * Get SDK version
   */
  getVersion(): string {
    return '1.0.0';
  }
}

// Export types for users
export * from './types.js';
export * from './errors.js';

// Export default instance
export default OxylabsAIStudioSDK; 