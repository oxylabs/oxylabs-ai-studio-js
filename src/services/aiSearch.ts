import { OxylabsAIStudioClient } from '../client';
import { 
  SearchOptions, 
  RunResponse,
  AiSearchRun,
  SearchRunDataResponse,
  SearchInstantResponse,
} from '../types';

/**
 * AI-Search Service
 * Handles all AI-Search related API calls
 */
export class AiSearchService {
  private client: OxylabsAIStudioClient;

  constructor(client: OxylabsAIStudioClient) {
    this.client = client;
  }

  /**
   * Submit search request (POST /search)
   */
  async submitSearchRequest(options: SearchOptions): Promise<RunResponse> {
    const payload: Record<string, any> = {
      query: options.query,
    };
    
    if (options.limit !== undefined) {
      payload.limit = options.limit;
    }
    if (options.render_javascript !== undefined) {
      payload.render_javascript = options.render_javascript;
    }
    if (options.return_content !== undefined) {
      payload.return_content = options.return_content;
    }
    if (options.geo_location !== undefined) {
      payload.geo_location = options.geo_location;
    }

    return await this.client.post<RunResponse>('/search/run', payload);
  }

  /**
   * Submit instant search request (POST /search/instant)
   * Returns data in realtime on the same connection without polling
   */
  async searchInstant(options: SearchOptions): Promise<SearchInstantResponse> {
    // Backwards-compatible method name for the /search/instant endpoint
    const payload: Record<string, any> = {
      query: options.query,
    };
    
    if (options.geo_location !== undefined) {
      payload.geo_location = options.geo_location;
    }
    if (options.limit !== undefined) {
      payload.limit = options.limit;
    }

    return await this.client.post<SearchInstantResponse>('/search/instant', payload);
  }

  /**
   * Get search run data/results (GET /search/run/data)
   */
  async getSearchRunData(runId: string): Promise<SearchRunDataResponse> {
    if (!runId) {
      throw new Error('run_id is required');
    }

    const params = new URLSearchParams();
    params.append('run_id', runId);

    const url = `/search/run/data?${params.toString()}`;

    return await this.client.get(url);
  }

  /**
   * Synchronous browsing (wait for results)
   * Automatically uses instant endpoint when limit <= 10 and return_content is false
   */
  async search(options: SearchOptions, timeout = 120000, pollInterval = 5000): Promise<AiSearchRun> {
    // Use instant endpoint if conditions are met for optimal performance
    const useInstant = (options.limit === undefined || options.limit <= 10) && 
                       (options.return_content === false || options.return_content === undefined);
    
    if (useInstant) {
      const instantResult = await this.searchInstant(options);
      return {
        run_id: instantResult.run_id,
        message: null,
        data: instantResult.data || []
      };
    }

    // Otherwise use the polling-based approach
    const submitResult = await this.submitSearchRequest(options);
    const runId = submitResult.run_id
    if (!runId) {
      throw new Error('No run ID returned from search request');
    }

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const response = await this.getSearchRunData(runId);
      if (response.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        continue;
      }
      else if (response.status === 'completed') {
        return {
          run_id: runId,
          message: response.message || null,
          data: response.data ? response.data : []
        }
      } else if (response.status === 'failed') {
        throw new Error(`Search failed: ${response.message || 'Unknown error'}`);
      }
      else {
        throw new Error(`Search failed: Unknown status ${response.status}`);
      }
    }
    throw new Error(`Search timeout after ${(timeout / 1000).toFixed(2)} seconds`);
  }
}