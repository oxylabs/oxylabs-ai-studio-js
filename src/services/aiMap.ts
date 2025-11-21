import { OxylabsAIStudioClient } from '../client.js';
import { 
  MapOptions, 
  RunResponse,
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
      return_sources_limit: options.return_sources_limit || undefined,
      geo_location: options.geo_location || undefined,
      render_html: options.render_javascript || undefined,
    };

    return await this.client.post<RunResponse>('/map', payload);
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
   * Synchronous mapping (wait for results)
   */
  async map(options: MapOptions, timeout = 300000, pollInterval = 5000): Promise<any> {
    const submitResult = await this.submitMapRequest(options);
    const runId = submitResult.run_id || submitResult.id;

    if (!runId) {
      throw new Error('No run ID returned from map request');
    }

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const response = await this.getMapRunData(runId);
      const status = response.status;
      console.log('Run status:', status);
      if (status === 'completed' || status === 'success') {
        return response.data
      } else if (status === 'failed' || status === 'error') {
        throw new Error(`Mapping failed: ${response.error_code || response.message || 'Unknown error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Mapping timeout after ${timeout}ms`);
  }
}