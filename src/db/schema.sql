-- Spyglass IDX Database Schema
-- PostgreSQL on Render

-- Community Zones table
-- Stores polygon data for 464 community areas
CREATE TABLE IF NOT EXISTS community_zones (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  
  -- Polygon coordinates stored as JSON array of [lng, lat] pairs
  -- Format matches Repliers API: [[lng, lat], [lng, lat], ...]
  polygon JSONB NOT NULL,
  
  -- Bounding box for quick spatial queries
  bounds_north DECIMAL(10, 7),
  bounds_south DECIMAL(10, 7),
  bounds_east DECIMAL(10, 7),
  bounds_west DECIMAL(10, 7),
  
  -- SEO/content fields
  description TEXT,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  
  -- Optional hero image
  image_url VARCHAR(500),
  
  -- Cached market stats (refreshed periodically)
  cached_listings_count INTEGER DEFAULT 0,
  cached_median_price INTEGER,
  cached_avg_price_sqft DECIMAL(10, 2),
  cached_avg_dom INTEGER,
  stats_updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for slug lookups (community pages)
CREATE INDEX IF NOT EXISTS idx_community_zones_slug ON community_zones(slug);

-- Index for bounding box queries (map view)
CREATE INDEX IF NOT EXISTS idx_community_zones_bounds ON community_zones(
  bounds_north, bounds_south, bounds_east, bounds_west
);

-- Saved searches table (future feature)
CREATE TABLE IF NOT EXISTS saved_searches (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  name VARCHAR(255),
  filters JSONB NOT NULL,
  notify_frequency VARCHAR(50) DEFAULT 'daily', -- daily, instant, weekly
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table (future feature)
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  mls_number VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, mls_number)
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_community_zones_updated_at ON community_zones;
CREATE TRIGGER update_community_zones_updated_at
  BEFORE UPDATE ON community_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_searches_updated_at ON saved_searches;
CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
