import { 
  OxylabsAIStudioSDK, 
  OutputFormat
} from 'oxylabs-ai-studio';


const sdk = new OxylabsAIStudioSDK();
const timeout = 120000;

async function testGenerateSchema() {
  try {
    console.log('Testing schema generation...');
    const schema = await sdk.aiScraper.generateSchema({
      user_prompt: 'Extract the title of the page'
    });
    console.log('Schema:', JSON.stringify(schema, null, 2));
  } catch (error) {
    console.error('Schema generation error:', error.message);
  }
}

async function testScrapeAutoSchema() {
  try {
    console.log('Testing synchronous scraping with auto-schema...');
    
    const options = {
      url: 'https://www.freelancer.com',
      parse_prompt: 'Extract all links',
      output_format: OutputFormat.JSON,
    };
    
    const results = await sdk.aiScraper.scrapeWithAutoSchema(options, timeout);
    console.log('Sync scraping results:', JSON.stringify(results, null, 2));
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
      schema: {
        type: 'object',
        properties: {
          links: { type: 'array', items: { type: 'string' } }
        }
      }
    };
    
    const results = await sdk.aiScraper.scrape(options, timeout);
    console.log('Sync scraping results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Sync scraping error:', error.message);
  }
}

async function testScrapeOutputCsv() {
  try {
    console.log('Testing synchronous scraping with JSON output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.CSV,
      schema: {
        type: 'object',
        properties: {
          links: { type: 'array', items: { type: 'string' } }
        }
      }
    };
    
    const results = await sdk.aiScraper.scrape(options, timeout);
    console.log('Sync scraping results:', JSON.stringify(results, null, 2));
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
      geo_location: 'DE',
    };
    
    const results = await sdk.aiScraper.scrape(options, timeout);
    console.log('Sync scraping results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Sync scraping error:', error.message);
  }
}

// Main execution
console.log('\n=== Testing AI Scrape Examples ===');

// Run examples
// await testGenerateSchema();
// await testScrapeOutputJson();
await testScrapeOutputCsv();
// await testScrapeOutputMarkdown(); 
// await testScrapeAutoSchema(); 