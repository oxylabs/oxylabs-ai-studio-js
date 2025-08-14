import { 
    OxylabsAIStudioSDK, 
  } from 'oxylabs-ai-studio';
  
  const sdk = new OxylabsAIStudioSDK();
  
  async function testAiMap() {
    try {
      console.log('Testing ai-map...');
      
      const options = {
        url: 'https://career.oxylabs.io',
        user_prompt: 'job ad pages',
        render_javascript: false,
        return_sources_limit: 10,
        geo_location: 'US',
    };
      
      const results = await sdk.aiMap.map(options);
      console.log('Results:', JSON.stringify(results, null, 2));      
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  console.log('\n=== Testing AI Map Examples ===');
  
  await testAiMap();