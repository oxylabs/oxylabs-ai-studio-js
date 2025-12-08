# Oxylabs AI Studio JavaScript SDK

[![AI-Studio Java (1)](https://raw.githubusercontent.com/oxylabs/oxylabs-ai-studio-js/refs/heads/main/images/Github-AI-Studio-1262x525px%20new.png)](https://aistudio.oxylabs.io/?utm_source=877&utm_medium=affiliate&utm_campaign=ai_studio&groupid=877&utm_content=ai-studio-js-github&transaction_id=102f49063ab94276ae8f116d224b67) 

[![](https://dcbadge.limes.pink/api/server/Pds3gBmKMH?style=for-the-badge&theme=discord)](https://discord.gg/Pds3gBmKMH) [![YouTube](https://img.shields.io/badge/YouTube-Oxylabs-red?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@oxylabs)

A JavaScript SDK for seamlessly interacting with [Oxylabs AI Studio API](https://aistudio.oxylabs.io/) services, including AI-Scraper, AI-Crawler, AI-Browser-Agent and other data extraction tools.

## Installation

```bash
npm install oxylabs-ai-studio
```

## Quick Start

### 1. Environment Setup

Either add `OXYLABS_AI_STUDIO_API_URL` and `OXYLABS_AI_STUDIO_API_KEY` values to the `.env` file, or as your environment variables:

```bash
export OXYLABS_AI_STUDIO_API_KEY=your_api_key_here
```

## AI-Scraper

### Generate Schema 

```javascript
import { 
  OxylabsAIStudioSDK
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK({
  apiKey: 'your_api_key_here',
  timeout: 120000,
  retryAttempts: 3,
});

async function testGenerateSchema() {
  try {
    console.log('Testing schema generation...');
    const schema = await sdk.aiScraper.generateSchema({
      user_prompt: 'Extract the title of the page'
    });
    console.log('Schema:', schema);
  } catch (error) {
    console.error('Schema generation error:', error.message);
  }
}

testGenerateSchema();
```

### Basic usage

```javascript
import { 
  OxylabsAIStudioSDK, 
  OutputFormat
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK({
  apiKey: 'your_api_key_here',
  timeout: 120000,
  retryAttempts: 3,
});

async function testScrapeOutputJson() {
  try {
    console.log('Testing synchronous scraping with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.JSON,
      geo_location: "US",
      schema: {
        type: 'object',
        properties: {
          links: { type: 'array', items: { type: 'string' } }
        }
      }
    };
    
    const results = await sdk.aiScraper.scrape(options);
    console.log('Sync scraping results:', results);
  } catch (error) {
    console.error('Sync scraping error:', error.message);
  }
}

testScrapeOutputJson();
```

### Available Parameters
- `url` (*string*): The target URL to process.
- `output_format` (*string*): The desired format for the output. Can be either `markdown`, `json`, `screenshot`, `csv` or `toon`. Defaults to `markdown`.
- `render_javascript` (*boolean | "auto"*): Whether to render JavaScript before extraction. Can be `"auto"` to auto-detect if rendering is needed. Defaults to `false`.
- `schema` (*Record<string, any>*): A JSON Schema object that defines the structure of the output data. This is required when `output_format` is `json`, `csv` or `toon`.
- `geo_location` (*string*): Specifies the geographic location (ISO2 format) or country canonical name from which the request should be simulated.
- `user_agent` (*string*): User-Agent request header. See [available values](https://developers.oxylabs.io/scraping-solutions/web-scraper-api/features/http-context-and-job-management/user-agent-type).

## AI-Crawler

### Basic usage

```javascript
import { 
  OxylabsAIStudioSDK, 
  OutputFormat
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK({
  apiKey: 'your_api_key_here',
  timeout: 120000,
  retryAttempts: 3,
});

async function testCrawlOutputJson() {
  try {
    console.log('Testing crawling with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.JSON,
      user_prompt: 'Get job ad pages',
      return_sources_limit: 3,
      geo_location: "Germany",
      schema: {
        type: "object",
        properties: {
          jobAd: {
            type: "object",
            properties: {
              position_title: {
                type: "string"
              },
              salary: {
                type: "string"
              }
            }
          }
        }
      }
    };
    
    const results = await sdk.aiCrawler.crawl(options);
    console.log('Crawling results:', JSON.stringify(results, null, 2));      
  } catch (error) {
    console.error('Crawling error:', error.message);
  }
}

testCrawlOutputJson();
```

### Available Parameters
- `url` (*string*): The starting URL for the crawl.
- `user_prompt` (*string*): Crawling instructions.
  - For auto-schema flow, use `parse_prompt` in `crawlWithAutoSchema()` to generate the `schema`.
- `output_format` (*string*): The desired format for the output. Can be either `markdown`, `json`, `csv` or `toon`. Defaults to `markdown`.
- `return_sources_limit` (*integer*): The maximum number of pages/sources to return. Defaults to `25`.
- `render_javascript` (*boolean*): Whether to render JavaScript on pages before extraction. Defaults to `false`.
- `schema` (*Record<string, any>*): A JSON Schema object that defines the structure of the output data. Required when `output_format` is `json`, `csv` or `toon`.
- `geo_location` (*string*): Specifies the geographic location (ISO2 format) or country canonical name from which the request should be simulated.
- `max_credits` (*integer | null*): Optional cap on credits to spend for the run.

## Browser-Agent

### Basic usage

```javascript
import { 
  OxylabsAIStudioSDK, 
  OutputFormat
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK({
  apiKey: 'your_api_key_here',
  timeout: 120000,
  retryAttempts: 3,
});

async function testBrowseOutputJson() {
  try {
    console.log('Testing synchronous browsing with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.JSON,
      user_prompt: 'Navigate to the first job ad you can find.',
      geo_location: "US",
      schema: {
        type: 'object',
        properties: {
          job_title: { type: 'string' }
        }
      }
    };
    
    const results = await sdk.browserAgent.browse(options);
    console.log('Sync browsing results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Sync browsing error:', error.message);
  }
}

testBrowseOutputJson();
```

### Available Parameters
- `url` (*string*): The target URL for the browser agent to start at.
- `user_prompt` (*string*): Instructions describing what actions to perform and data to extract.
  - For auto-schema flow, use `parse_prompt` in `browseWithAutoSchema()` to generate the `schema`.
- `output_format` (*string*): The desired format for the output. Can be `markdown`, `html`, `json`, `csv`, `toon`, or `screenshot`. Defaults to `markdown`.
- `schema` (*Record<string, any>*): A JSON Schema object that defines the structure of the output data. This is required when `output_format` is `json`, `csv` or `toon`.
- `geo_location` (*string*): Specifies the geographic location (ISO2 format) or country canonical name from which the request should be simulated.

## AI-Search

### Basic usage

```javascript
import {
  OxylabsAIStudioSDK,
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK({
  apiKey: 'your_api_key_here',
  timeout: 120000,
  retryAttempts: 3,
});

async function testSearch() {
  try {
    console.log('Testing search...');

    const options = {
      query: 'weather in London',
      limit: 3,
      return_content: true,
      render_javascript: false,
      geo_location: "IT",
    };

    const results = await sdk.aiSearch.search(options);
    console.log('Search results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Search error:', error.message);
  }
}

testSearch();
```

### Available Parameters
- `query` (*string*): The search query.
- `limit` (*integer*): The maximum number of search results to return. Maximum: 50.
- `geo_location` (*string*): ISO 2-letter format, country name, coordinate formats are supported. See more at [SERP Localization](https://developers.oxylabs.io/scraping-solutions/web-scraper-api/features/localization/serp-localization).

### Performance Optimization

The `search()` method automatically optimizes performance by intelligently choosing between two endpoints:

**Instant Endpoint** (used automatically when):
- `limit` is ≤ 10 (or undefined)
- AND `return_content` is `false` (or undefined)

This provides real-time results without polling for faster response times.

**Polling-based Endpoint** (used when):
- `limit` > 10
- OR `return_content` is `true`

You can also directly use `searchInstant()` method if you want to explicitly use the instant endpoint:

```javascript
const results = await sdk.aiSearch.searchInstant({
  query: 'weather today',
  geo_location: 'United States'
});
```
- `query` (*string*): The search query.
- `limit` (*integer*): The maximum number of search results to return. Maximum: 10.
- `geo_location` (*string*): Google's canonical name of the location. See more at [Google Ads GeoTargets](https://developers.google.com/google-ads/api/data/geotargets).

## AI-Map

### Basic usage

```javascript
import { 
  OxylabsAIStudioSDK
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK({
  apiKey: 'your_api_key_here',
  timeout: 120000,
  retryAttempts: 3,
});

async function testMap() {
  try {
    console.log('Testing map...');
    
    const options = {
      url: 'https://www.freelancer.com/jobs',
      user_prompt: 'Extract tech job ads',
      return_sources_limit: 10,
      geo_location: 'US',
      render_javascript: false
    };
    
    const results = await sdk.aiMap.map(options);
    console.log('Map results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Map error:', error.message);
  }
}

testMap();
```

### Available Parameters
- `url` (*string*): The target URL to map and discover URLs from.
- `search_keywords` (*string[]*): Optional keywords to bias the mapping.
- `user_prompt` (*string | null*): Optional instructions to focus the mapping on relevant areas.
- `limit` (*integer*): The maximum number of URLs to return (default `50`, max `10000`).
- `max_crawl_depth` (*integer*): Maximum depth to crawl within the site (default `1`, max `5`).
- `include_sitemap` (*boolean*): Whether to include sitemap URLs (default `true`).
- `allow_subdomains` (*boolean*): Whether to include subdomains (default `false`).
- `allow_external_domains` (*boolean*): Whether to include external domains (default `false`).
- `geo_location` (*string | null*): The location to use (ISO2 or country canonical name).
- `render_javascript` (*boolean*): Whether to render JavaScript when mapping (default `false`).
- `max_credits` (*integer | null*): Optional cap on credits to spend for the run.

## Running Examples

You can find more examples of each application here:

- [Browser-agent Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/browser-agent.js)
- [AI-Crawler Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/ai-crawler.js)
- [AI-Scraper Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/ai-scraper.js)
- [AI-Search Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/ai-search.js)
- [AI-Map Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/ai-map.js)
