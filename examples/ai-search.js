import { 
  OxylabsAIStudioSDK, 
} from 'oxylabs-ai-studio';


const sdk = new OxylabsAIStudioSDK();
const timeout = 120000;

async function testSearchWithoutContent() {
  try {
    console.log('Testing search without content...');
    
    const options = {
      query: 'lasagna recipes',
      limit: 10,
      return_content: false,
      render_javascript: false,
    };
    
    const results = await sdk.aiSearch.search(options, timeout);
    console.log('searching results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('searching error:', error.message);
  }
}

async function testSearchWithContent() {
  try {
    console.log('Testing search with content...');
    
    const options = {
      query: 'lasagna recipes',
      limit: 5,
      return_content: true,
      render_javascript: false,
    };
    
    const results = await sdk.aiSearch.search(options, timeout);
    console.log('searching results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('searching error:', error.message);
  }
}

// Main execution
console.log('\n=== Testing AI Search Examples ===');

// Run examples
await testSearchWithoutContent();
await testSearchWithContent();
