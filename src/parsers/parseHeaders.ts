import validator from 'validator';

/**
 * Parses headers from a raw IMF header string.
 * @param {string} rawHeaders - The raw headers as a string
 * @param {'strict'|'relaxed'} mode - Strict mode rejects emails with invalid headers. Relaxed simply deletes invalid headers.
 * @returns {Promise<Record<string, string | string[]>>} - A dictionary of headers (handling duplicates)
 * @throws {Error} - If any header fails validation.
 * @since 0.0.1
 */
export default async function parseHeaders(rawHeaders: string, mode: 'strict' | 'relaxed' = 'relaxed'): Promise<Record<string, string | string[]>> {
  const headers = parseString(rawHeaders);
  await validateHeaders(headers, mode === 'strict');
  return headers;
}

/**
 * Validates required headers and enforces proper formatting efficiently.
 * @param {Record<string, string | string[]>} headers - Parsed headers object.
 * @param {boolean} rejectErrors - Whether invalid header field values should throw an exception.
 * @throws {Error} If any header fails validation.
 * @since 0.0.2
 */
async function validateHeaders(headers: Record<string, string | string[]>, rejectErrors: boolean = false): Promise<void> {
  const errors: string[] = [];

  const validationRules: Record<string, (value: string) => boolean> = {
    'message-id': (val) => isValidEmailHeader(val, true) && /^<.*>$/.test(val),
    'from': isValidEmailHeader,
    'to': isValidEmailHeader,
    'cc': isValidEmailHeader,
    'bcc': isValidEmailHeader,
    'reply-to': isValidEmailHeader,
    'return-path': (val) => isValidEmailHeader(val, true) && /^<.*>$/.test(val),
    'in-reply-to': (val) => isValidEmailHeader(val, true) && /^<.*>$/.test(val),
    'date': (val) => !isNaN(Date.parse(val)) && /(Mon|Tue|Wed|Thu|Fri|Sat),\s*\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+([+-]\d{4})/i.test(val),
    'mime-version': (val) => /^1.0$/.test(val),
  };

  for (const [key, value] of Object.entries(headers)) {
    const normalizedKey = key.toLowerCase();
    const headerValue = Array.isArray(value) ? value[0].toString() : value.toString();

    if (validationRules[normalizedKey] && !validationRules[normalizedKey](headerValue))
      rejectErrors ? errors.push(`Invalid ${key}: ${headerValue}`) : delete headers[key];
  }

  if (errors.length > 0)
    throw new Error(`Header validation failed:\n${errors.join('\n')}`);
}

/**
 * Parses raw headers into a structured dictionary.
 * @param {string} rawHeaders The raw headers as a string.
 * @returns {Record<string, string | string[]>} Parsed headers object.
 * @since 0.0.2
 */
function parseString(rawHeaders: string): Record<string, string | string[]> {
  const headers: Record<string, string | string[]> = {};
  const lines = rawHeaders.split(/\r\n|\n/);

  let currentKey: string | null = null;
  let currentValue: string = '';

  for (const line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      // Handle folded headers (continuation lines)
      if (currentKey) {
        headers[currentKey] = Array.isArray(headers[currentKey])
          ? [...(headers[currentKey] as string[]).slice(0, -1), (headers[currentKey] as string[]).pop() + ' ' + line.trim()]
          : headers[currentKey] + ' ' + line.trim();
      } else {
        throw new Error('Header folding found without a preceding header field.');
      }
    } else {
      // Store previous header before starting a new one
      if (currentKey) {
        headers[currentKey] = headers[currentKey]
          ? (Array.isArray(headers[currentKey]) ? [...headers[currentKey] as string[], currentValue] : [headers[currentKey] as string, currentValue])
          : currentValue;
      }

      // Extract new header key-value pair
      const match = line.match(/^([!#$%&'*+\-.0-9A-Z^_`a-z|~]+):\s*(.*)$/);
      if (!match) throw new Error(`Invalid header format: "${line}"`);

      currentKey = match[1].toLowerCase();
      currentValue = match[2];
    }
  }

  // Store the last header
  if (currentKey) {
    headers[currentKey] = headers[currentKey]
      ? (Array.isArray(headers[currentKey]) ? [...headers[currentKey] as string[], currentValue] : [headers[currentKey] as string, currentValue])
      : currentValue;
  }

  return headers;
}

/**
 * Validates an email header field that may contain a display name and angle brackets.
 * @param {string} value - The email header value.
 * @param {boolean} [strict=false] - Whether to enforce strict validation (must have `<...>` format).
 * @returns {boolean} - True if valid, false otherwise.
 * @since 0.0.2
 */
function isValidEmailHeader(value: string, strict: boolean = false): boolean {
  const emailMatch = value.match(/<(.*?)>$/); // Extracts email inside <>
  const email = emailMatch ? emailMatch[1] : value; // Use extracted or raw value

  return strict ? !!emailMatch && validator.isEmail(email) : validator.isEmail(email);
}
