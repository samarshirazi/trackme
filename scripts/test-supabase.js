#!/usr/bin/env node

/**
 * Test script to verify Supabase connection and database setup
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../apps/desktop/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 TrackMe Supabase Connection Test\n');
console.log('═══════════════════════════════════════════════════════\n');

// Check environment variables
console.log('1️⃣  Checking environment variables...');
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('   Please check apps/desktop/.env file');
  process.exit(1);
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Anon Key:', supabaseKey.substring(0, 20) + '...\n');

// Create Supabase client
console.log('2️⃣  Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Client created successfully\n');

// Test connection
console.log('3️⃣  Testing database connection...');

async function testConnection() {
  try {
    // Try to query a simple table
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.error('\n💡 Common issues:');
      console.error('   - Make sure you ran the schema.sql in Supabase SQL Editor');
      console.error('   - Check that RLS policies are enabled');
      console.error('   - Verify the URL and key are correct');
      return false;
    }

    console.log('✅ Database connection successful!\n');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

// Check tables exist
console.log('4️⃣  Checking if required tables exist...');

async function checkTables() {
  const tables = [
    'profiles',
    'activity_sessions',
    'manual_checkins',
    'checkin_templates',
    'checkin_settings',
    'categorization_rules',
    'auto_projects',
    'user_preferences',
    'daily_summaries'
  ];

  let allExist = true;

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.error(`❌ Table '${table}' not found or not accessible`);
        allExist = false;
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (err) {
      console.error(`❌ Error checking table '${table}':`, err.message);
      allExist = false;
    }
  }

  return allExist;
}

// Test authentication
console.log('\n5️⃣  Testing authentication...');

async function testAuth() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error && error.message !== 'Auth session missing!') {
      console.error('❌ Auth error:', error.message);
      return false;
    }

    console.log('✅ Authentication system is working');
    console.log('   (No active session - this is normal)\n');
    return true;
  } catch (err) {
    console.error('❌ Auth test failed:', err.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('\n❌ Connection test failed. Please fix the issues above.\n');
    process.exit(1);
  }

  const tablesOk = await checkTables();
  if (!tablesOk) {
    console.error('\n❌ Some tables are missing.');
    console.error('💡 Please run the SQL from packages/database/schema.sql in Supabase SQL Editor\n');
    process.exit(1);
  }

  const authOk = await testAuth();
  if (!authOk) {
    console.error('\n❌ Authentication test failed.\n');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════\n');
  console.log('✅ All tests passed! Your Supabase setup is correct.\n');
  console.log('🚀 You can now run the app with: npm run desktop\n');
}

runTests().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
