import { OxylabsAIStudioClient } from '../client.js';
import { 
  MapOptions, 
  RunResponse,
  RunStatusResponse,
} from '../types.js';

/**
 * AI-Map Service
 * Handles all AI-Map related API calls
 */
export class AiMapService {
  private client: OxylabsAIStudioClient;

  constructor(client: OxylabsAIStudioClient) {
    this.client = client;
  }

  /**
   * Submit map request (POST /map)
   */
  async submitMapRequest(options: MapOptions): Promise<RunResponse> {
    const payload: any = {
      url: options.url,
      user_prompt: options.user_prompt,
      max_depth: options.max_depth,
      return_sources_limit: options.return_sources_limit,
      geo_location: options.geo_location,
      render_html: options.render_javascript || false
    };


    return await this.client.post<RunResponse>('/map', payload);
  }

  /**
   * Get map run status (GET /map/run)
   */
  async getMapRun(runId: string): Promise<RunStatusResponse> {
    if (!runId) {
      throw new Error('run_id is required');
    }
    
    const params = new URLSearchParams();
    params.append('run_id', runId);
    
    const url = `/map/run?${params.toString()}`;
    
    return await this.client.get<RunStatusResponse>(url);
  }

  /**
   * Get map run data/results (GET /map/run/data)
   */
  async getMapRunData(runId: string): Promise<any> {
    if (!runId) {
      throw new Error('run_id is required');
    }
    
    const params = new URLSearchParams();
    params.append('run_id', runId);
    
    const url = `/map/run/data?${params.toString()}`;
    
    return await this.client.get(url);
  }

  /**
   * Map URLs
   */
  async map(options: MapOptions, timeout = 60000, pollInterval = 5000): Promise<any> {
    const submitResult = await this.submitMapRequest(options);
    const runId = submitResult.run_id || submitResult.id;
    
    if (!runId) {
      throw new Error('No run ID returned from map request');
    }
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const runStatus = await this.getMapRun(runId);
      const run_status = runStatus.status;
      console.log('Run status:', run_status);
      if (run_status === 'completed' || run_status === 'success') {
        return await this.getMapRunData(runId);
      } else if (run_status === 'failed' || run_status === 'error') {
        throw new Error(`Mapping failed: ${runStatus.error || runStatus.message || 'Unknown error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Mapping timeout after ${timeout}ms`);
  }
}