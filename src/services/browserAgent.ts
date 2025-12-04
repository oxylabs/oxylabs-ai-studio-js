import { OxylabsAIStudioClient } from '../client';
import { 
  GenerateSchemaOptions, 
  BrowseOptions, 
  BrowseWithAutoSchemaOptions,
  RunResponse,
  SchemaResponse 
} from '../types';

/**
 * AI-Browse Service
 * Handles all AI-Browse related API calls
 */
export class BrowserAgentService {
  private client: OxylabsAIStudioClient;

  constructor(client: OxylabsAIStudioClient) {
    this.client = client;
  }

  /**
   * Generate schema for browsing (POST /browse/schema)
   */
  async generateSchema(options: GenerateSchemaOptions): Promise<SchemaResponse> {
    return await this.client.post<SchemaResponse>('/browser-agent/generate-params', options);
  }

  /**
   * Submit browsing request (POST /browse)
   */
  async submitBrowseRequest(options: BrowseOptions): Promise<RunResponse> {
    const payload: any = {
      url: options.url,
      output_format: options.output_format || "markdown",
      user_prompt: options.user_prompt,
      geo_location: options.geo_location || undefined
    };

    // Only include openapi_schema if output_format is json
    if ((options.output_format === "json" || options.output_format === "csv" || options.output_format === "toon") && options.schema) {
      payload.openapi_schema = options.schema;
    }

    return await this.client.post<RunResponse>('/browser-agent/run', payload);
  }


  /**
   * Get browsing run data/results (GET /browse/run/data)
   */
  async getBrowseRunData(runId: string): Promise<any> {
    if (!runId) {
      throw new Error('run_id is required');
    }

    const params = new URLSearchParams();
    params.append('run_id', runId);

    const url = `/browser-agent/run/data?${params.toString()}`;

    return await this.client.get(url);
  }

  /**
   * Synchronous browsing (wait for results)
   */
  async browse(options: BrowseOptions, timeout = 120000, pollInterval = 5000): Promise<any> {
    const submitResult = await this.submitBrowseRequest(options);
    const runId = submitResult.run_id || submitResult.id;

    if (!runId) {
      throw new Error('No run ID returned from browse request');
    }

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const response = await this.getBrowseRunData(runId);
      const run_status = response.status;
      console.log('Run status:', run_status);
      if (run_status === 'completed' || run_status === 'success') {
        return response.data
      } else if (run_status === 'failed' || run_status === 'error') {
        throw new Error(`Browsing failed: ${response.error_code || response.message || 'Unknown error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Browsing timeout after ${timeout}ms`);
  }

  /**
   * Complete workflow with auto-schema and sync results
   */
  async browseWithAutoSchema(options: BrowseWithAutoSchemaOptions, timeout = 60000): Promise<any> {
    // Generate schema first
    const schemaResult = await this.generateSchema({
      user_prompt: options.parse_prompt
    });

    console.log('schemaResult', JSON.stringify(schemaResult, null, 2));
    // Then perform synchronous browsing
    return await this.browse({
      url: options.url,
      user_prompt: options.user_prompt || "",
      output_format: options.output_format || "markdown",
      schema: schemaResult.openapi_schema,
      geo_location: options.geo_location || undefined
    }, timeout);
  }
}