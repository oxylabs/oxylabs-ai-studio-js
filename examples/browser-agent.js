import { 
  OxylabsAIStudioSDK, 
  OutputFormat,
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
      schema: {
        type: 'object',
        properties: {
          job_title: { type: 'string' }
        }
      }
    };
    
    const results = await sdk.browserAgent.browse(options, timeout);
    console.log('Sync browsing results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Sync browsing error:', error.message);
  }
}

async function testBrowseOutputCsv() {
  try {
    console.log('Testing synchronous browsing with CSV output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.CSV,
      user_prompt: 'Navigate to the first job ad you can find.',
      schema: {
        type: 'object',
        properties: {
          job_title: { type: 'string' }
        }
      }
    };
    
    const results = await sdk.browserAgent.browse(options, timeout);
    console.log('Sync browsing results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Sync browsing error:', error.message);
  }
}

async function testBrowseOutputMarkdown() {
  try {
    console.log('Testing synchronous browsing with Markdown output...');
    
    const options = {
      url: 'https://www.freelancer.com',
      output_format: OutputFormat.MARKDOWN,
      user_prompt: 'Navigate to the first job ad you can find.',
      geo_location: 'DE',
    };
    
    const results = await sdk.browserAgent.browse(options, timeout);
    console.log('Sync browsing results as markdown:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Sync browsing error:', error.message);
  }
}

async function testBrowseWithAutoSchema() {
  try {
    console.log('Testing browsing with auto-schema...');
    
    const options = {
      url: 'https://www.freelancer.com',
      user_prompt: 'Navigate to the first job ad',
      parse_prompt: 'Extract job information from the job ad',
      output_format: OutputFormat.JSON,
    };
    
    const results = await sdk.browserAgent.browseWithAutoSchema(options, timeout);
    console.log('Auto-schema browse results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Auto-schema browsing error:', error.message);
  }
}

// Main execution
console.log('\n=== Testing AI Browse Examples ===');

// Run examples
await testBrowseOutputJson();
await testBrowseOutputCsv();
await testBrowseOutputMarkdown();
await testBrowseWithAutoSchema(); 