import pg from 'pg';
import 'dotenv/config';

async function testSupabaseConnection() {
  const { Client } = pg;
  
  const connectionString = process.env.DATABASE_URL;
  console.log('Testing Supabase connection...');
  console.log('Connection string (password hidden):', connectionString?.replace(/:[^:@]+@/, ':****@'));
  
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected to Supabase successfully!');
    
    // Test basic query
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    // Check if our tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('📋 Tables in database:', tables.rows.map(r => r.table_name).join(', '));
    
    // Check user table
    const userCount = await client.query('SELECT COUNT(*) FROM "User"');
    console.log('👥 User count:', userCount.rows[0].count);
    
    // Check admin user
    const adminUser = await client.query('SELECT * FROM "User" WHERE email = $1', ['iphonehub@gmail.com']);
    if (adminUser.rows.length > 0) {
      console.log('✅ Admin user found:', adminUser.rows[0].email);
      console.log('   Role:', adminUser.rows[0].role);
      console.log('   Has password:', !!adminUser.rows[0].password);
    } else {
      console.log('❌ Admin user not found');
    }
    
    await client.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    await client.end().catch(() => {});
  }
}

testSupabaseConnection();