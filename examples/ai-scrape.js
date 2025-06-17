import { 
  OxylabsAIStudioSDK, 
  OutputFormat
} from 'oxylabs-ai-studio';


const sdk = new OxylabsAIStudioSDK();
const timeout = 120000;

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

async function testScrapeAutoSchema() {
  try {
    console.log('Testing synchronous scraping with auto-schema...');
    
    const options = {
      url: 'https://www.freelancer.com',
      user_prompt: 'Extract all links',
      output_format: OutputFormat.JSON,
    };
    
    const results = await sdk.aiScrape.scrapeWithAutoSchema(options, timeout);
    console.log('Sync scraping results:', results);
  } catch (error) {
    console.error('Sync scraping error:', error.message);
  }
}

async function testScrapeOutputJson() {
  try {
    console.log('Testing synchronous scraping with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
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

async function testScrapeOutputMarkdown() {
  try {
    console.log('Testing synchronous scraping with Markdown output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.MARKDOWN,
    };
    
    const results = await sdk.aiScrape.scrape(options, timeout);
    console.log('Sync scraping results:', results);
  } catch (error) {
    console.error('Sync scraping error:', error.message);
  }
}

// Main execution
console.log('\n=== Testing AI Scrape Examples ===');

// Run examples
testGenerateSchema();
testScrapeOutputJson();
testScrapeOutputMarkdown(); 
testScrapeAutoSchema(); 