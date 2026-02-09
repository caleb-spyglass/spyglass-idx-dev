/**
 * NLP Search Input Guards
 * 
 * Validates and sanitizes user input before forwarding to the
 * Repliers NLP endpoint. Defends against:
 * - Prompt injection attempts
 * - Oversized inputs
 * - Abuse patterns
 * 
 * See SECURITY.md §5 for full threat model.
 */

/** Maximum allowed prompt length in characters */
const MAX_PROMPT_LENGTH = 500;

/** Minimum prompt length (reject empty/trivial) */
const MIN_PROMPT_LENGTH = 3;

/**
 * Patterns that suggest prompt injection attempts.
 * These are common patterns used to manipulate LLMs.
 */
const INJECTION_PATTERNS: RegExp[] = [
  // System prompt manipulation
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)/i,
  /disregard\s+(all\s+)?(previous|prior|above)/i,
  /forget\s+(all\s+)?(previous|prior|your)\s+(instructions?|context|rules?)/i,
  
  // Role manipulation
  /you\s+are\s+now\s+(a|an|the)\s/i,
  /act\s+as\s+(a|an|if)\s/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /new\s+persona/i,
  
  // System message injection
  /\[system\]/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /<<SYS>>/i,
  
  // Data exfiltration attempts
  /what\s+(is|are)\s+your\s+(instructions?|system\s+prompt|rules?|api\s+key)/i,
  /reveal\s+(your|the)\s+(prompt|instructions?|system)/i,
  /show\s+(me\s+)?(your|the)\s+(prompt|instructions?|config)/i,
  /print\s+(your|the)\s+(system|initial)\s+(prompt|message)/i,
  
  // Code execution attempts
  /```[\s\S]*```/,
  /eval\s*\(/i,
  /exec\s*\(/i,
  /import\s+os/i,
  /require\s*\(/i,
];

export interface ValidationResult {
  valid: boolean;
  sanitized?: string;
  error?: string;
  errorCode?: 'empty' | 'too_short' | 'too_long' | 'injection' | 'invalid';
}

/**
 * Validate and sanitize an NLP search prompt.
 * 
 * @param prompt - Raw user input
 * @returns Validation result with sanitized prompt or error details
 * 
 * @example
 * ```ts
 * const result = validateNLPPrompt(userInput);
 * if (!result.valid) {
 *   return NextResponse.json({ error: result.error }, { status: 400 });
 * }
 * // Use result.sanitized for the API call
 * ```
 */
export function validateNLPPrompt(prompt: unknown): ValidationResult {
  // Type check
  if (typeof prompt !== 'string') {
    return {
      valid: false,
      error: 'Prompt must be a string',
      errorCode: 'invalid',
    };
  }

  // Trim and normalize whitespace
  const sanitized = prompt.trim().replace(/\s+/g, ' ');

  // Empty check
  if (sanitized.length === 0) {
    return {
      valid: false,
      error: 'Prompt is required',
      errorCode: 'empty',
    };
  }

  // Minimum length
  if (sanitized.length < MIN_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters`,
      errorCode: 'too_short',
    };
  }

  // Maximum length
  if (sanitized.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or less`,
      errorCode: 'too_long',
    };
  }

  // Prompt injection detection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      return {
        valid: false,
        error: 'Please ask about real estate listings. For example: "Find me a 3 bedroom house in Austin under $500k"',
        errorCode: 'injection',
      };
    }
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Sanitize NLP response summary for safe display.
 * The summary comes from the LLM and should be treated as untrusted.
 */
export function sanitizeNLPSummary(summary: unknown): string {
  if (typeof summary !== 'string') return '';
  
  // Strip HTML tags
  const stripped = summary.replace(/<[^>]*>/g, '');
  
  // Limit length
  const truncated = stripped.slice(0, 500);
  
  // Escape any remaining special characters for safe display
  return truncated
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
