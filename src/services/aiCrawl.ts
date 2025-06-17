import { OxylabsAIStudioClient } from '../client.js';
import { 
  GenerateSchemaOptions, 
  CrawlOptions, 
  CrawlWithAutoSchemaOptions,
  RunResponse,
  SchemaResponse 
} from '../types.js';

/**
 * AI-Crawl Service
 * Handles all AI-Crawl related API calls
 */
export class AiCrawlService {
  private client: OxylabsAIStudioClient;

  constructor(client: OxylabsAIStudioClient) {
    this.client = client;
  }

  /**
   * Generate schema for crawling (POST /crawl/schema)
   */
  async generateSchema(options: GenerateSchemaOptions): Promise<SchemaResponse> {
    return await this.client.post<SchemaResponse>('/crawl/schema', options);
  }

  /**
   * Submit crawling request (POST /extract/run)
   */
  async submitCrawlRequest(options: CrawlOptions): Promise<RunResponse> {
    const payload: any = {
      domain: options.url, // Note: API expects 'domain' but we use 'url' for consistency
      output_format: options.output_format || "markdown",
      auxiliary_prompt: options.user_prompt,
      render_html: options.render_html || false,
      return_sources_limit: options.max_pages || 25
    };

    // Only include openapi_schema if output_format is json
    if (options.output_format === "json" && options.openapi_schema) {
      payload.openapi_schema = options.openapi_schema;
    }

    return await this.client.post<RunResponse>('/extract/run', payload);
  }

  /**
   * Get crawling steps (GET /extract/run/steps)
   */
  async getCrawlRunSteps(runId: string): Promise<any> {
    if (!runId) {
      throw new Error('run_id is required');
    }

    const params = new URLSearchParams();
    params.append('run_id', runId);

    const url = `/extract/run/steps?${params.toString()}`;

    return await this.client.get(url);
  }

  /**
   * Get crawling run data/results (GET /extract/run/data)
   */
  async getCrawlRunData(runId: string): Promise<any> {
    if (!runId) {
      throw new Error('run_id is required');
    }

    const params = new URLSearchParams();
    params.append('run_id', runId);

    const url = `/extract/run/data?${params.toString()}`;

    return await this.client.get(url);
  }

  /**
   * Synchronous crawling (wait for results)
   */
  async crawl(options: CrawlOptions, timeout = 120000, pollInterval = 5000): Promise<any> {
    const submitResult = await this.submitCrawlRequest(options);
    const runId = submitResult.run_id || submitResult.id;

    if (!runId) {
      throw new Error('No run ID returned from crawl request');
    }

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const runStatus = await this.getCrawlRunSteps(runId);
      const run_status = runStatus.run.status;
      console.log('Run status:', run_status);
      if (run_status === 'completed' || run_status === 'success') {
        return await this.getCrawlRunData(runId);
      } else if (run_status === 'failed' || run_status === 'error') {
        throw new Error(`Crawling failed: ${runStatus.error || runStatus.message || 'Unknown error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Crawling timeout after ${timeout}ms`);
  }

  /**
   * Complete workflow with auto-schema and sync results
   */
  async crawlWithAutoSchema(options: CrawlWithAutoSchemaOptions, timeout = 60000): Promise<any> {
    // Generate schema first
    const schemaResult = await this.generateSchema({
      user_prompt: options.user_prompt
    });

    // Then perform synchronous crawling
    return await this.crawl({
      url: options.url,
      user_prompt: options.user_prompt || "",
      output_format: options.output_format || "markdown",
      openapi_schema: schemaResult.openapi_schema,
      max_pages: options.max_pages,
      render_html: options.render_html || false
    }, timeout);
  }
} 