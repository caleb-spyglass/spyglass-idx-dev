import { NextRequest, NextResponse } from 'next/server';
import { COMMUNITIES, CommunityPolygon as PolygonData } from '@/data/communities-polygons';
import { createRequestLogger } from '@/lib/logger';
import { validateNLPPrompt, sanitizeNLPSummary } from '@/lib/nlp-guard';
import { fetchWithRetry } from '@/lib/fetch-with-retry';
import { nlpLimiter, getClientIp } from '@/lib/rate-limit';

const REPLIERS_API_URL = process.env.REPLIERS_API_URL || 'https://api.repliers.io';
const REPLIERS_API_KEY = process.env.REPLIERS_API_KEY || '';

/** Timeout for Repliers NLP call (ms) — allow extra time for LLM processing */
const NLP_TIMEOUT_MS = 12_000;
/** Timeout for listings fetch after NLP (ms) */
const LISTINGS_TIMEOUT_MS = 8_000;

interface NLPRequest {
  prompt: string;
  nlpId?: string;
}

interface NLPResponse {
  request: {
    url: string;
    body: any | null;
    summary: string;
  };
  nlpId: string;
}

// Extract zip codes from prompt (5 digit numbers that look like Texas zips)
function extractZipCode(prompt: string): string | null {
  // Match 5-digit numbers that are likely Texas zip codes (7xxxx range for Austin area)
  const zipMatch = prompt.match(/\b(7[0-9]{4})\b/);
  return zipMatch ? zipMatch[1] : null;
}

/**
 * Find a matching community polygon from the user's search prompt.
 * Uses case-insensitive matching, trying longest names first to avoid
 * partial matches (e.g. "West Lake Hills" before "West Lake").
 */
function findCommunityFromPrompt(prompt: string): PolygonData | null {
  const normalizedPrompt = prompt.toLowerCase();
  
  // Sort by name length descending so longer (more specific) names match first
  const sorted = [...COMMUNITIES].sort((a, b) => b.name.length - a.name.length);
  
  for (const community of sorted) {
    const communityNameLower = community.name.toLowerCase();
    // Check if the community name appears in the prompt as a word/phrase boundary
    // Use word-boundary-ish check: the name should be preceded/followed by non-alpha or start/end
    const escapedName = communityNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedName}\\b`, 'i');
    if (regex.test(normalizedPrompt)) {
      return community;
    }
  }
  
  // Fallback: try matching slugs (e.g. "travis-heights" → "Travis Heights")
  for (const community of sorted) {
    const slugWords = community.slug.replace(/-/g, ' ');
    const escapedSlug = slugWords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSlug}\\b`, 'i');
    if (regex.test(normalizedPrompt)) {
      return community;
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST', '/api/nlp-search');

  // Rate limiting (10 req/min per IP)
  const clientIp = getClientIp(request);
  const rl = nlpLimiter.check(clientIp);
  if (!rl.allowed) {
    log.warn('Rate limit exceeded', { clientIp });
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'X-Request-Id': log.requestId, 'Retry-After': '60', 'X-RateLimit-Limit': String(rl.limit), 'X-RateLimit-Remaining': '0' } }
    );
  }

  try {
    const { prompt, nlpId }: NLPRequest = await request.json();

    // Validate and sanitize input (length limits, injection detection)
    const validation = validateNLPPrompt(prompt);
    if (!validation.valid) {
      log.warn('NLP prompt validation failed', { errorCode: validation.errorCode });
      return NextResponse.json(
        { error: validation.error },
        { status: 400, headers: { 'X-Request-Id': log.requestId } }
      );
    }

    const sanitizedPrompt = validation.sanitized!;
    log.info('NLP search started', { promptLength: sanitizedPrompt.length, hasNlpId: !!nlpId });

    // Pre-extract zip code from prompt as fallback
    const extractedZip = extractZipCode(sanitizedPrompt);
    
    // Try to match a community/neighborhood from the prompt
    const matchedCommunity = findCommunityFromPrompt(sanitizedPrompt);
    if (matchedCommunity) {
      log.info('Matched community from prompt', { community: matchedCommunity.name, slug: matchedCommunity.slug, polygonPoints: matchedCommunity.polygon.length });
    }

    // Call Repliers NLP endpoint
    const nlpPayload: NLPRequest = { prompt: sanitizedPrompt };
    if (nlpId) {
      nlpPayload.nlpId = nlpId;
    }

    const response = await fetchWithRetry(`${REPLIERS_API_URL}/nlp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'REPLIERS-API-KEY': REPLIERS_API_KEY,
      },
      body: JSON.stringify(nlpPayload),
      timeoutMs: NLP_TIMEOUT_MS,
      maxRetries: 1,
    });

    if (response.status === 406) {
      log.info('NLP rejected prompt as non-real-estate');
      return NextResponse.json({
        error: 'not_real_estate',
        message: 'Please ask about real estate listings. For example: "Find me a 3 bedroom house in Austin under $500k"',
      }, { status: 406, headers: { 'X-Request-Id': log.requestId } });
    }

    if (!response.ok) {
      const errorText = await response.text();
      log.error('Repliers NLP error', { status: response.status, error: errorText });
      return NextResponse.json(
        { error: 'Failed to process search' },
        { status: response.status, headers: { 'X-Request-Id': log.requestId } }
      );
    }

    const nlpResult: NLPResponse = await response.json();

    // Extract the generated URL and parse its params
    const generatedUrl = new URL(nlpResult.request.url);
    const searchParams = Object.fromEntries(generatedUrl.searchParams.entries());
    
    log.info('NLP generated search params', { url: generatedUrl.pathname, params: searchParams });

    // If NLP didn't extract zip but we found one in the prompt, add it
    if (extractedZip && !searchParams.zip) {
      log.info('Adding extracted zip code', { zip: extractedZip });
      generatedUrl.searchParams.set('zip', extractedZip);
      // Remove area param if zip is specified (zip is more specific)
      generatedUrl.searchParams.delete('area');
    }
    
    // If there's a zip, make sure area doesn't override it
    if (generatedUrl.searchParams.get('zip')) {
      generatedUrl.searchParams.delete('area');
    }

    // If we matched a community polygon, remove the generic area param
    // (the polygon will handle geographic filtering much more precisely)
    if (matchedCommunity) {
      generatedUrl.searchParams.delete('area');
      // Also remove neighborhood/city if NLP set something generic
      generatedUrl.searchParams.delete('neighborhood');
    }

    // Default to Sale unless user explicitly mentions rental/lease
    const rentalKeywords = /\b(rent|rental|lease|leasing|for rent|apartment|renting)\b/i;
    if (!rentalKeywords.test(prompt)) {
      generatedUrl.searchParams.set('type', 'Sale');
    }

    // Build the polygon ring for Repliers POST body if we have a community match
    // Repliers expects: { map: [[[lng, lat], [lng, lat], ...]] }
    let postBody: any = undefined;
    if (matchedCommunity && matchedCommunity.polygon.length >= 3) {
      // polygon data is already in [lng, lat] format — perfect for Repliers
      const ring = [...matchedCommunity.polygon];
      // Close the ring if not already closed
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
      }
      postBody = { map: [ring] };
      log.info('Using polygon filter', { community: matchedCommunity.name, ringPoints: ring.length });
    }

    // Fetch listings — use POST with polygon body if available, otherwise GET
    let listingsResponse: Response;
    if (postBody) {
      listingsResponse = await fetchWithRetry(`${REPLIERS_API_URL}/listings?${generatedUrl.searchParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'REPLIERS-API-KEY': REPLIERS_API_KEY,
        },
        body: JSON.stringify(postBody),
        timeoutMs: LISTINGS_TIMEOUT_MS,
        maxRetries: 2,
      });
    } else {
      listingsResponse = await fetchWithRetry(`${REPLIERS_API_URL}/listings?${generatedUrl.searchParams.toString()}`, {
        headers: {
          'REPLIERS-API-KEY': REPLIERS_API_KEY,
        },
        timeoutMs: LISTINGS_TIMEOUT_MS,
        maxRetries: 2,
      });
    }

    if (!listingsResponse.ok) {
      throw new Error('Failed to fetch listings');
    }

    const listingsData = await listingsResponse.json();

    // Transform listings to our format (reuse logic from listings route)
    const transformedListings = listingsData.listings?.map((raw: any) => ({
      id: raw.mlsNumber,
      mlsNumber: raw.mlsNumber,
      address: {
        street: `${raw.address.streetNumber} ${raw.address.streetName} ${raw.address.streetSuffix || ''}`.trim(),
        city: raw.address.city,
        state: raw.address.state,
        zip: raw.address.zip,
        full: `${raw.address.streetNumber} ${raw.address.streetName} ${raw.address.streetSuffix || ''}, ${raw.address.city}, ${raw.address.state} ${raw.address.zip}`.trim(),
        neighborhood: raw.address.neighborhood || undefined,
      },
      price: raw.listPrice,
      bedrooms: raw.details.numBedrooms || 0,
      bathrooms: raw.details.numBathrooms || 0,
      sqft: typeof raw.details.sqft === 'string' ? parseInt(raw.details.sqft, 10) || 0 : raw.details.sqft || 0,
      propertyType: raw.details.propertyType || 'Single Family',
      status: raw.status === 'A' ? 'Active' : raw.status,
      daysOnMarket: raw.daysOnMarket || 0,
      photos: raw.images?.map((img: string) => `https://cdn.repliers.io/${img}`) || [],
      coordinates: {
        lat: raw.map?.latitude,
        lng: raw.map?.longitude,
      },
      listDate: raw.listDate,
      updatedAt: raw.lastUpdate || raw.listDate,
    })) || [];

    log.done('NLP search completed', { resultCount: transformedListings.length, total: listingsData.count || transformedListings.length, matchedCommunity: matchedCommunity?.name || null });

    return NextResponse.json({
      // NLP metadata
      nlpId: nlpResult.nlpId,
      summary: sanitizeNLPSummary(nlpResult.request.summary),
      searchParams,
      
      // Listings
      listings: transformedListings,
      total: listingsData.count || transformedListings.length,
      
      // Community match info (so the frontend can highlight the polygon on the map)
      matchedCommunity: matchedCommunity ? {
        name: matchedCommunity.name,
        slug: matchedCommunity.slug,
      } : null,
      
      // Image search body if present
      imageSearch: nlpResult.request.body?.imageSearchItems || null,
    }, { headers: { 'X-Request-Id': log.requestId } });

  } catch (error) {
    log.error('NLP search failed', { error: String(error) });
    return NextResponse.json(
      { error: 'Failed to process AI search' },
      { status: 500, headers: { 'X-Request-Id': log.requestId } }
    );
  }
}
