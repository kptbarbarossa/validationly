// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ozuwdijovszuakcgay.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here';

console.log('🧪 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Database accessible');
    
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️ Auth test failed (normal if not logged in):', authError.message);
    } else {
      console.log('✅ Auth system working');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();