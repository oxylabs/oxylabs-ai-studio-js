import { OxylabsAIStudioClient } from '../client.js';
import { 
  GenerateSchemaOptions, 
  ScrapeOptions, 
  ScrapeWithAutoSchemaOptions,
  RunResponse,
  RunStatusResponse,
  SchemaResponse 
} from '../types.js';

/**
 * AI-Scraper Service
 * Handles all AI-Scraper related API calls
 */
export class AiScraperService {
  private client: OxylabsAIStudioClient;

  constructor(client: OxylabsAIStudioClient) {
    this.client = client;
  }

  /**
   * Generate schema for scraping (POST /scrape/schema)
   */
  async generateSchema(options: GenerateSchemaOptions): Promise<SchemaResponse> {
    return await this.client.post<SchemaResponse>('/scrape/schema', options);
  }

  /**
   * Submit scraping request (POST /scrape)
   */
  async submitScrapeRequest(options: ScrapeOptions): Promise<RunResponse> {
    console.log('Submitting scrape request with options:', options);
    const payload: any = {
      url: options.url,
      output_format: options.output_format || "markdown",
      render_html: options.render_html || false
    };

    // Only include openapi_schema if output_format is json
    if (options.output_format === "json" && options.openapi_schema) {
      payload.openapi_schema = options.openapi_schema;
    }

    return await this.client.post<RunResponse>('/scrape', payload);
  }

  /**
   * Get scraping run status (GET /scrape/run)
   */
  async getScrapeRun(runId: string): Promise<RunStatusResponse> {
    if (!runId) {
      throw new Error('run_id is required');
    }
    
    const params = new URLSearchParams();
    params.append('run_id', runId);
    
    const url = `/scrape/run?${params.toString()}`;
    
    return await this.client.get<RunStatusResponse>(url);
  }

  /**
   * Get scraping run data/results (GET /scrape/run/data)
   */
  async getScrapeRunData(runId: string): Promise<any> {
    if (!runId) {
      throw new Error('run_id is required');
    }
    
    const params = new URLSearchParams();
    params.append('run_id', runId);
    
    const url = `/scrape/run/data?${params.toString()}`;
    
    return await this.client.get(url);
  }

  /**
   * Synchronous scraping (wait for results)
   */
  async scrape(options: ScrapeOptions, timeout = 60000, pollInterval = 5000): Promise<any> {
    const submitResult = await this.submitScrapeRequest(options);
    const runId = submitResult.run_id || submitResult.id;
    
    if (!runId) {
      throw new Error('No run ID returned from scrape request');
    }
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const runStatus = await this.getScrapeRun(runId);
      const run_status = runStatus.status;
      console.log('Run status:', run_status);
      if (run_status === 'completed' || run_status === 'success') {
        return await this.getScrapeRunData(runId);
      } else if (run_status === 'failed' || run_status === 'error') {
        throw new Error(`Scraping failed: ${runStatus.error || runStatus.message || 'Unknown error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    throw new Error(`Scraping timeout after ${timeout}ms`);
  }

  /**
   * Complete workflow with auto-schema and sync results
   */
  async scrapeWithAutoSchema(options: ScrapeWithAutoSchemaOptions, timeout = 60000): Promise<any> {
    // Generate schema first
    const schemaResult = await this.generateSchema({
      user_prompt: options.user_prompt
    });

    // Then perform synchronous scraping
    return await this.scrape({
      url: options.url,
      user_prompt: "",
      output_format: options.output_format || "markdown",
      openapi_schema: schemaResult.openapi_schema,
      render_html: options.render_html || false
    }, timeout);
  }
} 