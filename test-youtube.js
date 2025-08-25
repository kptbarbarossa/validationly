// Test YouTube API directly
const testYouTube = async () => {
  console.log('🧪 Testing YouTube API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'startup idea validation',
        action: 'search'
      })
    });
    
    const result = await response.json();
    console.log('✅ YouTube API test result:', result);
    
    if (result.success) {
      console.log('📺 Videos found:', result.data.videos?.length || 0);
    } else {
      console.error('❌ YouTube API failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ YouTube test failed:', error);
  }
};

testYouTube();