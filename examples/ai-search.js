import { 
  OxylabsAIStudioSDK, 
} from 'oxylabs-ai-studio';


const sdk = new OxylabsAIStudioSDK();
const timeout = 120000;

async function testSearchWithoutContent() {
  try {
    console.log('Testing search without content...');
    
    const options = {
      query: 'lasagna',
      limit: 10,
      return_content: false,
      render_javascript: false,
      geo_location: 'IT',
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

async function testInstantSearch() {
  try {
    console.log('Testing instant search...');
    
    const options = {
      query: 'weather today',
      geo_location: 'United States',
    };
    
    const results = await sdk.aiSearch.searchInstant(options);
    console.log('Instant search results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Instant search error:', error.message);
  }
}

// Main execution
console.log('\n=== Testing AI Search Examples ===');

// Run examples
await testSearchWithoutContent();
await testSearchWithContent();
await testInstantSearch();
