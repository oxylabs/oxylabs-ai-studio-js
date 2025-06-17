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

async function testCrawlAutoSchema() {
  try {
    console.log('Testing crawling with auto-schema...');
    
    const options = {
      url: 'https://www.freelancer.com',
      user_prompt: 'Get job ad pages and extract position titles and salaries',
      max_pages: 2,
      output_format: OutputFormat.JSON,
    };
    
    const results = await sdk.aiCrawl.crawlWithAutoSchema(options);
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
      user_prompt: 'Get job ad pages',
      max_pages: 2,
    };
    
    const results = await sdk.aiCrawl.crawl(options);
    console.log('Crawling results as markdown:', results);
  } catch (error) {
    console.error('Crawling error:', error.message);
  }
}

// Main execution
console.log('\n=== Testing AI Crawl Examples ===');

// Run examples
testCrawlOutputJson();
testCrawlAutoSchema();
testCrawlOutputMarkdown(); 