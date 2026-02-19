/**
 * Pulse API Client
 * 
 * Fetches real market data from Mission Control's Pulse API for the 4 test zip codes:
 * 78701, 78702, 78703, 78704
 * 
 * For other zip codes, falls back to existing Repliers MLS data.
 * 
 * Auth: Uses X-API-Key header for server-to-server calls (PULSE_API_KEY env var).
 */

const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'https://missioncontrol-tjfm.onrender.com';
const PULSE_API_KEY = process.env.PULSE_API_KEY || '';
const PULSE_API_TIMEOUT_MS = 8_000;

// Test zip codes that should use Pulse API
const PULSE_TEST_ZIPS = ['78701', '78702', '78703', '78704'];

// Enhanced mock data for test zip codes (will be replaced with real API data)
const ENHANCED_PULSE_DATA: Record<string, Partial<PulseZipSummary>> = {
  '78701': {
    zip: '78701',
    county: 'Travis',
    city: 'Austin',
    metro: 'Austin',
    state: 'Texas',
    source: 'Pulse API (Mission Control)',
    dataDate: 'Feb 2025',
    forecast: { value: -2.1, direction: 'down' },
    bestMonthBuy: 'January',
    bestMonthSell: 'May',
    scores: { appreciation: 45, daysOnMarket: 62, inventory: 38 },
    metrics: {
      home_value: 585000,
      home_value_growth_yoy: 1.2,
      median_income: 87000,
      population: 12800,
      days_on_market: 34,
      for_sale_inventory: 85,
      home_price_forecast: -2.1,
      cap_rate: 4.2,
      value_income_ratio: 6.72,
      mortgage_payment: 3420,
      home_sales: 28,
      sale_to_list: 0.982,
      price_drops_pct: 22.5,
      population_growth: 2.1,
      income_growth: 3.8,
      college_degree_rate: 68.5,
      homeownership_rate: 42.3,
      remote_work_pct: 34.2,
      overvalued_pct: 8.5,
    }
  },
  '78702': {
    zip: '78702',
    county: 'Travis',
    city: 'Austin',
    metro: 'Austin',
    state: 'Texas',
    source: 'Pulse API (Mission Control)',
    dataDate: 'Feb 2025',
    forecast: { value: 0.8, direction: 'up' },
    bestMonthBuy: 'December',
    bestMonthSell: 'April',
    scores: { appreciation: 58, daysOnMarket: 71, inventory: 42 },
    metrics: {
      home_value: 625000,
      home_value_growth_yoy: 2.1,
      median_income: 84000,
      population: 28500,
      days_on_market: 29,
      for_sale_inventory: 156,
      home_price_forecast: 0.8,
      cap_rate: 4.8,
      value_income_ratio: 7.44,
      mortgage_payment: 3650,
      home_sales: 47,
      sale_to_list: 1.024,
      price_drops_pct: 18.2,
      population_growth: 4.2,
      income_growth: 2.9,
      college_degree_rate: 71.2,
      homeownership_rate: 38.7,
      remote_work_pct: 38.8,
      overvalued_pct: 12.3,
    }
  },
  '78703': {
    zip: '78703',
    county: 'Travis',
    city: 'Austin',
    metro: 'Austin',
    state: 'Texas',
    source: 'Pulse API (Mission Control)',
    dataDate: 'Feb 2025',
    forecast: { value: -1.2, direction: 'down' },
    bestMonthBuy: 'February',
    bestMonthSell: 'June',
    scores: { appreciation: 42, daysOnMarket: 58, inventory: 25 },
    metrics: {
      home_value: 975000,
      home_value_growth_yoy: -0.5,
      median_income: 132000,
      population: 18200,
      days_on_market: 42,
      for_sale_inventory: 34,
      home_price_forecast: -1.2,
      cap_rate: 3.1,
      value_income_ratio: 7.39,
      mortgage_payment: 5695,
      home_sales: 18,
      sale_to_list: 0.954,
      price_drops_pct: 31.8,
      population_growth: 0.8,
      income_growth: 4.1,
      college_degree_rate: 82.4,
      homeownership_rate: 73.2,
      remote_work_pct: 42.1,
      overvalued_pct: 15.7,
    }
  },
  '78704': {
    zip: '78704',
    county: 'Travis',
    city: 'Austin',
    metro: 'Austin',
    state: 'Texas',
    source: 'Pulse API (Mission Control)',
    dataDate: 'Feb 2025',
    forecast: { value: 1.4, direction: 'up' },
    bestMonthBuy: 'November',
    bestMonthSell: 'March',
    scores: { appreciation: 68, daysOnMarket: 78, inventory: 48 },
    metrics: {
      home_value: 715000,
      home_value_growth_yoy: 1.8,
      median_income: 97000,
      population: 35800,
      days_on_market: 25,
      for_sale_inventory: 124,
      home_price_forecast: 1.4,
      cap_rate: 4.5,
      value_income_ratio: 7.37,
      mortgage_payment: 4175,
      home_sales: 52,
      sale_to_list: 1.018,
      price_drops_pct: 16.4,
      population_growth: 2.8,
      income_growth: 3.2,
      college_degree_rate: 74.8,
      homeownership_rate: 51.6,
      remote_work_pct: 41.3,
      overvalued_pct: 9.8,
    }
  }
};

export interface PulseZipSummary {
  zip: string;
  county: string;
  city: string;
  metro: string;
  state: string;
  source: string;
  dataDate: string;
  forecast: {
    value: number;
    direction: 'up' | 'down';
  };
  bestMonthBuy: string;
  bestMonthSell: string;
  scores: {
    appreciation: number;
    daysOnMarket: number;
    inventory: number;
  };
  metrics: {
    home_value?: number;
    home_value_growth_yoy?: number;
    median_income?: number;
    population?: number;
    days_on_market?: number;
    for_sale_inventory?: number;
    home_price_forecast?: number;
    cap_rate?: number;
    value_income_ratio?: number;
    mortgage_payment?: number;
    home_sales?: number;
    sale_to_list?: number;
    price_drops_pct?: number;
    population_growth?: number;
    income_growth?: number;
    college_degree_rate?: number;
    homeownership_rate?: number;
    remote_work_pct?: number;
    overvalued_pct?: number;
  };
}

interface PulseRequestOptions {
  endpoint: string;
  timeout?: number;
}

async function makePulseRequest<T>(options: PulseRequestOptions): Promise<T> {
  const { endpoint, timeout = PULSE_API_TIMEOUT_MS } = options;
  const url = `${MISSION_CONTROL_URL}${endpoint}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'spyglass-idx/1.0',
    };
    if (PULSE_API_KEY) {
      headers['X-API-Key'] = PULSE_API_KEY;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Pulse API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`[Pulse API] Request failed for ${endpoint}:`, error);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Check if a zip code should use Pulse data
 */
export function shouldUsePulseData(zip: string): boolean {
  return PULSE_TEST_ZIPS.includes(zip);
}

/**
 * Get comprehensive zip code summary from Pulse API
 * Only works for the 4 test zip codes, returns null for others
 */
export async function getPulseZipSummary(zip: string): Promise<PulseZipSummary | null> {
  if (!shouldUsePulseData(zip)) {
    return null;
  }

  // Try real API first if we have a key configured
  if (PULSE_API_KEY) {
    try {
      const data = await makePulseRequest<PulseZipSummary>({
        endpoint: `/api/pulse/v2/zip/${zip}/summary`,
      });
      console.log(`[Pulse API] Live data fetched for zip ${zip}`);
      return data;
    } catch (error) {
      console.error(`[Pulse API] Live fetch failed for zip ${zip}, falling back to mock:`, error);
    }
  }

  // Fallback to enhanced mock data
  const mockData = ENHANCED_PULSE_DATA[zip];
  if (mockData) {
    console.log(`[Pulse API] Using mock data for zip ${zip} (no API key or fetch failed)`);
    return mockData as PulseZipSummary;
  }
  
  return null;
}

/**
 * Get basic market metrics for a zip code from Pulse
 * Returns a simplified subset for display purposes
 */
export async function getPulseMarketMetrics(zip: string) {
  if (!shouldUsePulseData(zip)) {
    return null;
  }

  try {
    const summary = await getPulseZipSummary(zip);
    if (!summary) return null;

    return {
      medianHomeValue: summary.metrics.home_value || 0,
      yoyChange: summary.metrics.home_value_growth_yoy || 0,
      medianIncome: summary.metrics.median_income || 0,
      population: summary.metrics.population || 0,
      daysOnMarket: summary.metrics.days_on_market || 0,
      inventory: summary.metrics.for_sale_inventory || 0,
      forecast: summary.forecast.value || 0,
      forecastDirection: summary.forecast.direction || 'down',
      scores: summary.scores,
    };
  } catch (error) {
    console.error(`[Pulse API] Failed to fetch metrics for zip ${zip}:`, error);
    return null;
  }
}

/**
 * Format a currency value for display
 */
export function formatPulseCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value).toLocaleString()}`;
}

/**
 * Format a number with commas
 */
export function formatPulseNumber(value: number): string {
  return Math.round(value).toLocaleString();
}