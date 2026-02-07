/**
 * Follow Up Boss API Client
 * 
 * Routes IDX lead capture form submissions to FUB as new leads/events.
 * Docs: https://docs.followupboss.com/reference
 */

const FUB_API_URL = 'https://api.followupboss.com/v1';
const FUB_API_KEY = process.env.FUB_API_KEY || '';

interface FUBRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT';
  body?: Record<string, unknown>;
}

async function fubRequest<T>({ endpoint, method = 'GET', body }: FUBRequestOptions): Promise<T> {
  const url = `${FUB_API_URL}${endpoint}`;
  
  // FUB uses Basic auth with API key as username, no password
  const authHeader = 'Basic ' + Buffer.from(`${FUB_API_KEY}:`).toString('base64');

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FUB API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Create or update a person in FUB
 * If a person with the same email exists, FUB will merge/update
 */
export async function createOrUpdatePerson(data: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}): Promise<{ id: number; email: string }> {
  const nameParts = data.firstName.split(' ');
  const firstName = nameParts[0];
  const lastName = data.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

  const person = await fubRequest<{ id: number; emails: Array<{ value: string }> }>({
    endpoint: '/people',
    method: 'POST',
    body: {
      firstName,
      lastName,
      emails: [{ value: data.email, isPrimary: true }],
      phones: data.phone ? [{ value: data.phone, isPrimary: true }] : [],
      source: data.source || 'Spyglass IDX Website',
      tags: data.tags || ['IDX Lead'],
      ...(data.customFields ? { customFields: data.customFields } : {}),
    },
  });

  return { id: person.id, email: data.email };
}

/**
 * Log an event (note/activity) on a person
 */
export async function logEvent(data: {
  personId: number;
  message: string;
  type?: 'Note' | 'PropertyInquiry' | 'PropertyViewed';
}): Promise<void> {
  await fubRequest({
    endpoint: '/events',
    method: 'POST',
    body: {
      person: { id: data.personId },
      source: 'SpyglassIDX',
      type: data.type || 'PropertyInquiry',
      message: data.message,
    },
  });
}

/**
 * Submit a lead from the IDX site contact form
 * Creates/updates the person and logs the inquiry
 */
export async function submitLead(data: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  formType: 'contact' | 'showing' | 'info';
  listingAddress?: string;
  mlsNumber?: string;
  communityName?: string;
  preferredDate?: string;
  preferredTime?: string;
}): Promise<{ personId: number; success: boolean }> {
  // Determine tags based on form type
  const tags: string[] = ['IDX Lead'];
  if (data.formType === 'showing') tags.push('Showing Request');
  if (data.formType === 'contact') tags.push('Contact Request');
  if (data.communityName) tags.push(`Community: ${data.communityName}`);

  // Create/update person
  const person = await createOrUpdatePerson({
    firstName: data.name,
    email: data.email,
    phone: data.phone,
    source: 'Spyglass IDX Website',
    tags,
  });

  // Build event message
  const messageParts: string[] = [];
  
  if (data.formType === 'showing') {
    messageParts.push('🏠 SHOWING REQUEST from Spyglass IDX');
  } else {
    messageParts.push('📩 CONTACT REQUEST from Spyglass IDX');
  }

  if (data.listingAddress) {
    messageParts.push(`Property: ${data.listingAddress}`);
  }
  if (data.mlsNumber) {
    messageParts.push(`MLS#: ${data.mlsNumber}`);
  }
  if (data.communityName) {
    messageParts.push(`Community: ${data.communityName}`);
  }
  if (data.preferredDate) {
    messageParts.push(`Preferred Date: ${data.preferredDate}`);
  }
  if (data.preferredTime) {
    messageParts.push(`Preferred Time: ${data.preferredTime}`);
  }
  if (data.message) {
    messageParts.push(`Message: ${data.message}`);
  }

  // Log the event
  await logEvent({
    personId: person.id,
    message: messageParts.join('\n'),
    type: data.formType === 'showing' ? 'PropertyInquiry' : 'Note',
  });

  return { personId: person.id, success: true };
}

/**
 * Search for a person by email
 */
export async function findPersonByEmail(email: string): Promise<{ id: number } | null> {
  try {
    const result = await fubRequest<{ people: Array<{ id: number }> }>({
      endpoint: `/people?email=${encodeURIComponent(email)}`,
    });
    return result.people.length > 0 ? { id: result.people[0].id } : null;
  } catch {
    return null;
  }
}
