import { Readable } from 'node:stream';
import Email from './types/Email.js';
import parseEnvelope from './parsers/parseEnvelope.js';
import parseMessage from './parsers/parseMessage.js';
import type Envelope from './types/Envelope.js';

/**
 * Parses an email message from raw data and an envelope object.
 *
 * @param {string | Readable} rawData - The raw email message content.
 * @param {object} envelope - The envelope containing sender/recipient metadata.
 * @returns {Promise<Email>} A parsed email object.
 * @since 0.0.1
 */
export default async function parseEmail(
  rawData: string | Readable,
  envelope: object,
): Promise<Email> {
  const parsedEnvelope: Envelope = await parseEnvelope(envelope);
  const { headers, body }: { headers: Record<string, string | string[]>; body: string } = await parseMessage(rawData);

  return new Email(parsedEnvelope, headers, body);
}

export { Email, Envelope };
