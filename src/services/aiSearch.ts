import { OxylabsAIStudioClient } from '../client';
import { 
  SearchOptions, 
  RunResponse,
  AiSearchRun,
  SearchRunDataResponse,
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
      payload.render_html = options.render_javascript;
    }
    if (options.return_content !== undefined) {
      payload.return_content = options.return_content;
    }

    return await this.client.post<RunResponse>('/search/run', payload);
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
   */
  async search(options: SearchOptions, timeout = 120000, pollInterval = 5000): Promise<AiSearchRun> {
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