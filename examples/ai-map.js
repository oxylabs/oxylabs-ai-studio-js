import { OxylabsAIStudioSDK } from 'oxylabs-ai-studio';


const sdk = new OxylabsAIStudioSDK();

async function testMap() {
    try {
        console.log('Testing map...');
        const map = await sdk.aiMap.map({
            url: 'https://www.freelancer.com/jobs',
            user_prompt: 'Extract tech job ads',
            max_depth: 2,
            return_sources_limit: 10,
            geo_location: 'US',
        });
        console.log('Map:', JSON.stringify(map, null, 2));
    } catch (error) {
        console.error('Map error:', error.message);
    }
}

await testMap();