// Test script for platforms
const testPlatforms = async () => {
  console.log('🧪 Testing platforms...');
  
  try {
    const response = await fetch('http://localhost:3000/api/multi-platform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'AI-powered startup idea validation tool',
        maxResults: 5
      })
    });
    
    const result = await response.json();
    console.log('✅ Multi-platform test result:', result);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testPlatforms();