/**
 * PostgreSQL Database Client
 * Connects to the Render PostgreSQL database for MLS data storage and retrieval
 */

import { Pool, PoolClient, QueryResult } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create a connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Render requires SSL
  max: 10, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

export { pool };

export interface DatabaseClient {
  query: (text: string, params?: any[]) => Promise<QueryResult>;
  release: () => void;
}

/**
 * Get a database client from the pool
 */
export async function getClient(): Promise<DatabaseClient> {
  const client = await pool.connect();
  return {
    query: client.query.bind(client),
    release: client.release.bind(client),
  };
}

/**
 * Execute a query directly on the pool
 */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('Query error', { text, duration, error });
    throw error;
  }
}

/**
 * Initialize database tables for MLS data caching
 */
export async function initializeDatabase() {
  try {
    // Create listings cache table
    await query(`
      CREATE TABLE IF NOT EXISTS listings_cache (
        mls_number VARCHAR(50) PRIMARY KEY,
        listing_data JSONB NOT NULL,
        polygon_data JSONB,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour')
      )
    `);

    // Create communities cache table
    await query(`
      CREATE TABLE IF NOT EXISTS communities_cache (
        slug VARCHAR(100) PRIMARY KEY,
        community_data JSONB NOT NULL,
        polygon JSONB,
        display_polygon JSONB,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
      )
    `);

    // Create market stats cache table
    await query(`
      CREATE TABLE IF NOT EXISTS market_stats_cache (
        area_key VARCHAR(200) PRIMARY KEY,
        stats_data JSONB NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 hours')
      )
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_listings_cache_expires 
      ON listings_cache(expires_at)
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_communities_cache_expires 
      ON communities_cache(expires_at)
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_market_stats_expires 
      ON market_stats_cache(expires_at)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Clean up expired cache entries
 */
export async function cleanupCache() {
  try {
    const now = new Date().toISOString();
    
    await query('DELETE FROM listings_cache WHERE expires_at < $1', [now]);
    await query('DELETE FROM communities_cache WHERE expires_at < $1', [now]);
    await query('DELETE FROM market_stats_cache WHERE expires_at < $1', [now]);
    
    console.log('Cache cleanup completed');
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}

/**
 * Close the database connection pool
 */
export async function closeDatabase() {
  await pool.end();
}

export default pool;