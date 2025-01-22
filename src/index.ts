import { Readable } from 'node:stream';
import { Email } from './types/Email';
import parseEnvelope from './parsers/parseEnvelope';
import parseMessage from './parsers/parseMessage';

export default async function parseEmail(
  rawData: string | Readable,
  envelope: object,
): Promise<Email> {
  const parsedEnvelope = await parseEnvelope(envelope);
  const { headers, body } = await parseMessage(rawData);

  return new Email(parsedEnvelope, headers, body);
}
