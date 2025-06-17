# Oxylabs AI Studio JavaScript SDK

A JavaScript SDK for seamlessly interacting with Oxylabs AI Studio API services, including AI-Scrape, AI-Crawl, AI-Browser-Agent and other data extraction tools.

## Installation

```bash
npm install oxylabs-ai-studio
```

## Quick Start

### 1. Environment Setup

Either add `OXYLABS_AI_STUDIO_API_URL` and `OXYLABS_AI_STUDIO_API_KEY` values to the `.env` file, or as your environment variables:

```bash
export OXYLABS_AI_STUDIO_API_URL=https://api-aistudio.oxylabs.io/v1
export OXYLABS_AI_STUDIO_API_KEY=your_api_key_here
```

## AI-Scrape

### Generate Schema

```javascript
import { 
  OxylabsAIStudioSDK
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK();

async function testGenerateSchema() {
  try {
    console.log('Testing schema generation...');
    const schema = await sdk.aiScrape.generateSchema({
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

const sdk = new OxylabsAIStudioSDK();
const timeout = 120000;



async function testScrapeOutputJson() {
  try {
    console.log('Testing synchronous scraping with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      user_prompt: 'Extract all links',
      output_format: OutputFormat.JSON,
      openapi_schema: {
        type: 'object',
        properties: {
          links: { type: 'array', items: { type: 'string' } }
        }
      }
    };
    
    const results = await sdk.aiScrape.scrape(options, timeout);
    console.log('Sync scraping results:', results);
  } catch (error) {
    console.error('Sync scraping error:', error.message);
  }
}

testScrapeOutputJson();
```

## AI-Crawl

### Basic usage

```javascript
import { 
  OxylabsAIStudioSDK, 
  OutputFormat
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK();

async function testCrawlOutputJson() {
  try {
    console.log('Testing crawling with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.JSON,
      user_prompt: 'Get job ad pages',
      max_pages: 3,
      openapi_schema: {
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
    
    const results = await sdk.aiCrawl.crawl(options);
    console.log('Crawling results:', JSON.stringify(results, null, 2));      
  } catch (error) {
    console.error('Crawling error:', error.message);
  }
}

testCrawlOutputJson();
```


## AI-Browser-Agent

### Basic usage

```javascript
import { 
  OxylabsAIStudioSDK, 
  OutputFormat
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK();
const timeout = 120000;

async function testBrowseOutputJson() {
  try {
    console.log('Testing synchronous browsing with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.JSON,
      user_prompt: 'Navigate to the first job ad you can find.',
      openapi_schema: {
        type: 'object',
        properties: {
          job_title: { type: 'string' }
        }
      }
    };
    
    const results = await sdk.aiBrowse.browse(options, timeout);
    console.log('Sync browsing results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Sync browsing error:', error.message);
  }
}

testBrowseOutputJson();
```

## Running Examples

After installing the package, you can run the JavaScript examples directly:

```bash
# Set up your environment variables
export OXYLABS_AI_STUDIO_API_URL=https://api.oxylabs.io
export OXYLABS_AI_STUDIO_API_KEY=your_api_key_here

# Run examples
node node_modules/oxylabs-ai-studio/examples/ai-scrape.js
node node_modules/oxylabs-ai-studio/examples/ai-crawl.js
node node_modules/oxylabs-ai-studio/examples/ai-browse.js
```
