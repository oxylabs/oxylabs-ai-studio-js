# Oxylabs AI Studio JavaScript SDK

A JavaScript SDK for seamlessly interacting with Oxylabs AI Studio API services, including AI-Scraper, AI-Crawler, AI-Browser-Agent and other data extraction tools.

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
      user_prompt: 'Extract all links',
      output_format: OutputFormat.JSON,
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
- `user_prompt` (*string*): Instructions for what data to extract. This is used to automatically generate the `openapi_schema` when using the `scrapeWithAutoSchema` method.
- `output_format` (*string*): The desired format for the output. Can be either `markdown` or `json`. Defaults to `markdown`.
- `render_html` (*boolean*): Specifies whether to render JavaScript on the page before extraction. Defaults to `false`.
- `openapi_schema` (*Record<string, any>*): A JSON Schema object that defines the structure of the output data. This is required when `output_format` is set to `json`.

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
- `crawl_prompt` (*string*): Instructions defining the types of pages to find and crawl.
- `parse_prompt` (*string*): Instructions for what data to extract from the crawled pages. This is used to automatically generate the `openapi_schema` when using the `crawlWithAutoSchema` method.
- `output_format` (*string*): The desired format for the output. Can be either `markdown` or `json`. Defaults to `markdown`.
- `max_pages` (*integer*): The maximum number of pages or sources to return. Defaults to `25`.
- `render_html` (*boolean*): Specifies whether to render JavaScript on the pages before extraction. Defaults to `false`.
- `openapi_schema` (*Record<string, any>*): A JSON Schema object that defines the structure of the output data. This is required when `output_format` is set to `json`.

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
- `browse_prompt` (*string*): Instructions defining the actions the browser agent should perform.
- `parse_prompt` (*string*): Instructions for what data to extract after performing the browser actions. This is used to automatically generate the `openapi_schema` when using the `browseWithAutoSchema` method.
- `output_format` (*string*): The desired format for the output. Can be `markdown`, `html`, `json`, or `screenshot`. Defaults to `markdown`.
- `render_html` (*boolean*): Specifies whether to render JavaScript on the page. Although this is a browser agent, this flag might influence certain behaviors. Defaults to `false`.
- `openapi_schema` (*Record<string, any>*): A JSON Schema object that defines the structure of the output data. This is required when `output_format` is set to `json`.

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
- `render_javascript` (*boolean*): Whether to render JavaScript on the page. Defaults to `false`.
- `return_content` (*boolean*): Whether to return the markdown content of each of the search result. Defaults to `true`.

## Running Examples

You can find more examples of each application here:

- [Browser-agent Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/browser-agent.js)
- [AI-Crawler Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/ai-crawler.js)
- [AI-Scraper Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/ai-scraper.js)
- [AI-Search Example](https://github.com/oxylabs/oxylabs-ai-studio-js/blob/main/examples/ai-search.js)
