import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/follow-up-boss';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, phone, message, formType, listingAddress, mlsNumber, communityName, preferredDate, preferredTime } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if FUB API key is configured
    if (!process.env.FUB_API_KEY) {
      console.warn('FUB_API_KEY not set — logging lead locally only');
      console.log('Lead submission (no CRM):', { name, email, phone, formType, listingAddress, mlsNumber, communityName });
      return NextResponse.json({ 
        success: true, 
        message: 'Lead captured (CRM not configured)',
        personId: null 
      });
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

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      personId: result.personId,
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    
    // Still return success to the user — don't expose CRM errors
    // Log the error for debugging
    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll be in touch soon.',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
