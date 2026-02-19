#!/usr/bin/env node

/**
 * Database Initialization Script
 * Sets up PostgreSQL tables for MLS data caching
 */

import { config } from 'dotenv';

// Load environment variables
config();

// Using dynamic imports for better compatibility
async function main() {
  console.log('🚀 Initializing Spyglass IDX database...');
  
  try {
    const { initializeDatabase, closeDatabase, query } = await import('../src/lib/database.ts');
    
    await initializeDatabase();
    console.log('✅ Database initialized successfully!');
    
    // Test the connection
    const result = await query('SELECT NOW() as current_time');
    console.log('🔄 Database connection test:', result.rows[0].current_time);
    
    await closeDatabase();
    console.log('🔒 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);