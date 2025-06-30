import { 
  OxylabsAIStudioSDK, 
  OutputFormat,
} from 'oxylabs-ai-studio';

const sdk = new OxylabsAIStudioSDK();

async function testCrawlOutputJson() {
  try {
    console.log('Testing crawling with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.JSON,
      crawl_prompt: 'Get job ad pages and extract position titles and salaries',
      max_pages: 3,
      openapi_schema: {
        "type": "object",
        "properties": {
            "jobAds": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "positionTitle": {
                            "type": "string"
                        },
                        "salary": {
                            "type": "number"
                        }
                    },
                    "required": []
                }
            }
        },
        "required": []
    }
  };
    
    const results = await sdk.aiCrawler.crawl(options);
    console.log('Crawling results:', JSON.stringify(results, null, 2));      
  } catch (error) {
    console.error('Crawling error:', error.message);
  }
}

async function testCrawlAutoSchema() {
  try {
    console.log('Testing crawling with auto-schema...');
    
    const options = {
      url: 'https://www.freelancer.com',
      crawl_prompt: 'Get job ad pages and extract position titles and salaries',
      parse_prompt: 'job ad pages and extract position titles and salaries',
      max_pages: 2,
      output_format: OutputFormat.JSON,
    };
    
    const results = await sdk.aiCrawler.crawlWithAutoSchema(options, 240000);
    console.log('Auto-schema crawling results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Auto-schema crawling error:', error.message);
  }
}

async function testCrawlOutputMarkdown() {
  try {
    console.log('Testing crawling with Markdown output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.MARKDOWN,
      crawl_prompt: 'Get job ad pages',
      max_pages: 2,
    };
    
    const results = await sdk.aiCrawler.crawl(options);
    console.log('Crawling results as markdown:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Crawling error:', error.message);
  }
}

// Main execution
console.log('\n=== Testing AI Crawl Examples ===');

// Run examples
await testCrawlOutputJson();
await testCrawlAutoSchema();
await testCrawlOutputMarkdown(); 