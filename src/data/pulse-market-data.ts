/**
 * Pulse Market Data — Static snapshot of market metrics from the Pulse app (AgentHubPortal).
 *
 * Source: ~/clawd/AgentHubPortal/server/pulseV2Routes.ts
 * Data includes: REALISTIC_HOME_VALUES, REALISTIC_INCOMES, REALISTIC_POPULATIONS
 *
 * TODO: Set up a monthly cron job to refresh this data from the Pulse API endpoint:
 *   GET /api/pulse/v2/zip/:zip/summary
 * This would keep the IDX site's market snapshots current without manual updates.
 * The cron could run on the 1st of each month and regenerate this file.
 */

export interface PulseMarketData {
  medianHomeValue: number;
  yoyChange: number; // Year-over-year price change percentage
  medianIncome: number;
  population: number;
  valueToIncomeRatio: number;
  pricePerSqftEstimate: number; // Estimated based on home value
}

/**
 * Per-zip-code market data extracted from the Pulse app's realistic data sets.
 * YoY changes are derived from the Pulse mockValueForLayer seeded random approach
 * with Austin-typical ranges of -3% to +4%.
 */
export const PULSE_MARKET_DATA: Record<string, PulseMarketData> = {
  // Central Austin
  '78701': {
    medianHomeValue: 550000,
    yoyChange: 1.2,
    medianIncome: 85000,
    population: 12500,
    valueToIncomeRatio: 6.47,
    pricePerSqftEstimate: 450,
  },
  '78702': {
    medianHomeValue: 600000,
    yoyChange: 2.1,
    medianIncome: 82000,
    population: 28000,
    valueToIncomeRatio: 7.32,
    pricePerSqftEstimate: 420,
  },
  '78703': {
    medianHomeValue: 950000,
    yoyChange: -0.5,
    medianIncome: 130000,
    population: 18000,
    valueToIncomeRatio: 7.31,
    pricePerSqftEstimate: 520,
  },
  '78704': {
    medianHomeValue: 700000,
    yoyChange: 1.8,
    medianIncome: 95000,
    population: 35000,
    valueToIncomeRatio: 7.37,
    pricePerSqftEstimate: 425,
  },
  '78705': {
    medianHomeValue: 500000,
    yoyChange: 0.3,
    medianIncome: 42000,
    population: 32000,
    valueToIncomeRatio: 11.90,
    pricePerSqftEstimate: 380,
  },

  // East Austin
  '78721': {
    medianHomeValue: 400000,
    yoyChange: 3.2,
    medianIncome: 52000,
    population: 15000,
    valueToIncomeRatio: 7.69,
    pricePerSqftEstimate: 310,
  },
  '78722': {
    medianHomeValue: 520000,
    yoyChange: 1.5,
    medianIncome: 72000,
    population: 12000,
    valueToIncomeRatio: 7.22,
    pricePerSqftEstimate: 370,
  },
  '78723': {
    medianHomeValue: 450000,
    yoyChange: 2.4,
    medianIncome: 68000,
    population: 35000,
    valueToIncomeRatio: 6.62,
    pricePerSqftEstimate: 330,
  },
  '78724': {
    medianHomeValue: 320000,
    yoyChange: 3.8,
    medianIncome: 50000,
    population: 25000,
    valueToIncomeRatio: 6.40,
    pricePerSqftEstimate: 230,
  },

  // Northwest Austin
  '78717': {
    medianHomeValue: 520000,
    yoyChange: 0.8,
    medianIncome: 105000,
    population: 30000,
    valueToIncomeRatio: 4.95,
    pricePerSqftEstimate: 260,
  },
  '78726': {
    medianHomeValue: 580000,
    yoyChange: 0.2,
    medianIncome: 110000,
    population: 22000,
    valueToIncomeRatio: 5.27,
    pricePerSqftEstimate: 280,
  },
  '78728': {
    medianHomeValue: 420000,
    yoyChange: 1.1,
    medianIncome: 78000,
    population: 25000,
    valueToIncomeRatio: 5.38,
    pricePerSqftEstimate: 240,
  },
  '78731': {
    medianHomeValue: 700000,
    yoyChange: -0.3,
    medianIncome: 110000,
    population: 25000,
    valueToIncomeRatio: 6.36,
    pricePerSqftEstimate: 380,
  },
  '78732': {
    medianHomeValue: 750000,
    yoyChange: -0.8,
    medianIncome: 125000,
    population: 15000,
    valueToIncomeRatio: 6.00,
    pricePerSqftEstimate: 310,
  },
  '78733': {
    medianHomeValue: 900000,
    yoyChange: -1.2,
    medianIncome: 145000,
    population: 12000,
    valueToIncomeRatio: 6.21,
    pricePerSqftEstimate: 400,
  },
  '78734': {
    medianHomeValue: 650000,
    yoyChange: -0.5,
    medianIncome: 100000,
    population: 20000,
    valueToIncomeRatio: 6.50,
    pricePerSqftEstimate: 290,
  },
  '78735': {
    medianHomeValue: 620000,
    yoyChange: 0.4,
    medianIncome: 105000,
    population: 28000,
    valueToIncomeRatio: 5.90,
    pricePerSqftEstimate: 280,
  },
  '78737': {
    medianHomeValue: 520000,
    yoyChange: 1.3,
    medianIncome: 95000,
    population: 20000,
    valueToIncomeRatio: 5.47,
    pricePerSqftEstimate: 250,
  },
  '78738': {
    medianHomeValue: 680000,
    yoyChange: -0.2,
    medianIncome: 120000,
    population: 25000,
    valueToIncomeRatio: 5.67,
    pricePerSqftEstimate: 300,
  },
  '78739': {
    medianHomeValue: 530000,
    yoyChange: 0.6,
    medianIncome: 98000,
    population: 22000,
    valueToIncomeRatio: 5.41,
    pricePerSqftEstimate: 265,
  },

  // South Austin
  '78741': {
    medianHomeValue: 380000,
    yoyChange: 2.8,
    medianIncome: 55000,
    population: 42000,
    valueToIncomeRatio: 6.91,
    pricePerSqftEstimate: 290,
  },
  '78744': {
    medianHomeValue: 340000,
    yoyChange: 2.5,
    medianIncome: 52000,
    population: 40000,
    valueToIncomeRatio: 6.54,
    pricePerSqftEstimate: 230,
  },
  '78745': {
    medianHomeValue: 450000,
    yoyChange: 1.4,
    medianIncome: 72000,
    population: 48000,
    valueToIncomeRatio: 6.25,
    pricePerSqftEstimate: 300,
  },
  '78746': {
    medianHomeValue: 1200000,
    yoyChange: -1.5,
    medianIncome: 180000,
    population: 22000,
    valueToIncomeRatio: 6.67,
    pricePerSqftEstimate: 550,
  },
  '78748': {
    medianHomeValue: 430000,
    yoyChange: 1.0,
    medianIncome: 82000,
    population: 35000,
    valueToIncomeRatio: 5.24,
    pricePerSqftEstimate: 250,
  },
  '78749': {
    medianHomeValue: 520000,
    yoyChange: 0.5,
    medianIncome: 100000,
    population: 30000,
    valueToIncomeRatio: 5.20,
    pricePerSqftEstimate: 270,
  },
  '78750': {
    medianHomeValue: 550000,
    yoyChange: 0.1,
    medianIncome: 105000,
    population: 28000,
    valueToIncomeRatio: 5.24,
    pricePerSqftEstimate: 275,
  },
  '78751': {
    medianHomeValue: 530000,
    yoyChange: 0.9,
    medianIncome: 75000,
    population: 18000,
    valueToIncomeRatio: 7.07,
    pricePerSqftEstimate: 370,
  },
  '78752': {
    medianHomeValue: 400000,
    yoyChange: 2.0,
    medianIncome: 60000,
    population: 22000,
    valueToIncomeRatio: 6.67,
    pricePerSqftEstimate: 300,
  },
  '78753': {
    medianHomeValue: 360000,
    yoyChange: 2.2,
    medianIncome: 55000,
    population: 50000,
    valueToIncomeRatio: 6.55,
    pricePerSqftEstimate: 240,
  },
  '78754': {
    medianHomeValue: 350000,
    yoyChange: 3.0,
    medianIncome: 52000,
    population: 30000,
    valueToIncomeRatio: 6.73,
    pricePerSqftEstimate: 230,
  },
  '78756': {
    medianHomeValue: 600000,
    yoyChange: 0.7,
    medianIncome: 90000,
    population: 12000,
    valueToIncomeRatio: 6.67,
    pricePerSqftEstimate: 400,
  },
  '78757': {
    medianHomeValue: 520000,
    yoyChange: 0.4,
    medianIncome: 82000,
    population: 20000,
    valueToIncomeRatio: 6.34,
    pricePerSqftEstimate: 350,
  },
  '78758': {
    medianHomeValue: 370000,
    yoyChange: 1.8,
    medianIncome: 58000,
    population: 42000,
    valueToIncomeRatio: 6.38,
    pricePerSqftEstimate: 250,
  },
  '78759': {
    medianHomeValue: 560000,
    yoyChange: 0.3,
    medianIncome: 100000,
    population: 32000,
    valueToIncomeRatio: 5.60,
    pricePerSqftEstimate: 290,
  },

  // Suburbs
  '78613': {
    medianHomeValue: 430000,
    yoyChange: 1.5,
    medianIncome: 95000,
    population: 65000,
    valueToIncomeRatio: 4.53,
    pricePerSqftEstimate: 220,
  },
  '78617': {
    medianHomeValue: 310000,
    yoyChange: 3.5,
    medianIncome: 50000,
    population: 20000,
    valueToIncomeRatio: 6.20,
    pricePerSqftEstimate: 190,
  },
  '78620': {
    medianHomeValue: 600000,
    yoyChange: 0.8,
    medianIncome: 110000,
    population: 15000,
    valueToIncomeRatio: 5.45,
    pricePerSqftEstimate: 270,
  },
  '78628': {
    medianHomeValue: 400000,
    yoyChange: 1.2,
    medianIncome: 82000,
    population: 55000,
    valueToIncomeRatio: 4.88,
    pricePerSqftEstimate: 210,
  },
  '78641': {
    medianHomeValue: 380000,
    yoyChange: 2.0,
    medianIncome: 82000,
    population: 70000,
    valueToIncomeRatio: 4.63,
    pricePerSqftEstimate: 200,
  },
  '78645': {
    medianHomeValue: 520000,
    yoyChange: -0.3,
    medianIncome: 80000,
    population: 12000,
    valueToIncomeRatio: 6.50,
    pricePerSqftEstimate: 260,
  },
  '78652': {
    medianHomeValue: 380000,
    yoyChange: 2.2,
    medianIncome: 75000,
    population: 10000,
    valueToIncomeRatio: 5.07,
    pricePerSqftEstimate: 220,
  },
};

/**
 * Get Pulse market data for a zip code.
 * Returns undefined if we don't have data for this zip.
 */
export function getPulseData(zipCode: string): PulseMarketData | undefined {
  return PULSE_MARKET_DATA[zipCode];
}

/**
 * Format a dollar value for display.
 */
export function formatDollar(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}
