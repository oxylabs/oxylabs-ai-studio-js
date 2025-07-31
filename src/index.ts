import * as dotenv from 'dotenv';
import { OxylabsAIStudioClient } from './client.js';
import { BrowserAgentService } from './services/browserAgent.js';
import { AiCrawlerService } from './services/aiCrawler.js';
import { AiMapService } from './services/aiMap.js';
import { AiScraperService } from './services/aiScraper.js';
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
  public readonly aiScraper: AiScraperService;
  public readonly aiCrawler: AiCrawlerService;
  public readonly browserAgent: BrowserAgentService;
  public readonly aiSearch: AiSearchService;
  public readonly aiMap: AiMapService;
  constructor(config: SDKConfig = {}) {
    const apiUrl = config.apiUrl || process.env.OXYLABS_AI_STUDIO_API_URL || 'https://api-aistudio.oxylabs.io';
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
    this.aiScraper = new AiScraperService(this.client);
    this.aiCrawler = new AiCrawlerService(this.client);
    this.browserAgent = new BrowserAgentService(this.client);
    this.aiSearch = new AiSearchService(this.client);
    this.aiMap = new AiMapService(this.client);
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