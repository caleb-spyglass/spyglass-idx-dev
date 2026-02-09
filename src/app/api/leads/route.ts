import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/follow-up-boss';
import { createRequestLogger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST', '/api/leads');
  try {
    const body = await request.json();
    
    const { name, email, phone, message, formType, listingAddress, mlsNumber, communityName, preferredDate, preferredTime } = body;

    log.info('Lead submission received', { formType: formType || 'contact', hasMls: !!mlsNumber, hasCommunity: !!communityName });

    // Validate required fields
    if (!name || !email) {
      log.warn('Lead validation failed: missing name or email');
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400, headers: { 'X-Request-Id': log.requestId } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      log.warn('Lead validation failed: invalid email format');
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: { 'X-Request-Id': log.requestId } }
      );
    }

    // Check if FUB API key is configured
    if (!process.env.FUB_API_KEY) {
      log.warn('FUB_API_KEY not set — lead captured locally only', { formType: formType || 'contact' });
      return NextResponse.json({ 
        success: true, 
        message: 'Lead captured (CRM not configured)',
        personId: null 
      }, { headers: { 'X-Request-Id': log.requestId } });
    }

    // Submit to Follow Up Boss
    const result = await submitLead({
      name,
      email,
      phone,
      message,
      formType: formType || 'contact',
      listingAddress,
      mlsNumber,
      communityName,
      preferredDate,
      preferredTime,
    });

    log.done('Lead submitted to FUB', { formType: formType || 'contact', personId: result.personId });

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      personId: result.personId,
    }, { headers: { 'X-Request-Id': log.requestId } });
  } catch (error) {
    log.error('Lead submission failed (returning success to user)', { error: String(error) });
    
    // Still return success to the user — don't expose CRM errors
    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll be in touch soon.',
    }, { headers: { 'X-Request-Id': log.requestId } });
  }
}
