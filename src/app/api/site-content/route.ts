import { NextResponse } from 'next/server';

const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'https://missioncontrol-tjfm.onrender.com';

// Cache site content in memory for 5 minutes
let cachedContent: any = null;
let cachedAt = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const now = Date.now();
    
    // Return cached content if still fresh
    if (cachedContent && (now - cachedAt) < CACHE_TTL) {
      return NextResponse.json(cachedContent);
    }

    // Fetch from Mission Control's public endpoint
    const res = await fetch(`${MISSION_CONTROL_URL}/api/site-content`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!res.ok) {
      console.error(`[site-content] Mission Control returned ${res.status}`);
      // Return cached content even if stale, or null
      if (cachedContent) return NextResponse.json(cachedContent);
      return NextResponse.json({}, { status: 502 });
    }

    const data = await res.json();
    cachedContent = data;
    cachedAt = now;

    return NextResponse.json(data);
  } catch (error) {
    console.error('[site-content] Error fetching from Mission Control:', error);
    // Return stale cache if available
    if (cachedContent) return NextResponse.json(cachedContent);
    return NextResponse.json({}, { status: 502 });
  }
}
