import { Readable } from 'node:stream';
import parseHeaders from './parseHeaders.js';
import streamToString from '../utils/streamToString.js';

/**
 * Parses the raw email message (headers + body).
 * @param rawData - Raw IMF email (string or stream)
 * @returns Parsed email components
 */
export default async function parseMessage(rawData: string | Readable): Promise<{ headers: Record<string, string | string[]>, body: string }> {
  let rawEmail: string;

  if (typeof rawData === 'string') {
    rawEmail = rawData;
  } else {
    rawEmail = await streamToString(rawData);
  }

  const headerBoundary = rawEmail.indexOf('\r\n\r\n');
  const rawHeaders = rawEmail.slice(0, headerBoundary);
  const body = rawEmail.slice(headerBoundary + 4)
  if (body.length === 0) {
    throw new Error('Header and Body must be separated by \\r\\n\\r\\n');
  }

  return {
    headers: await parseHeaders(rawHeaders),
    body,
  };
}
