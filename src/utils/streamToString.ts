import { Readable } from 'node:stream';

/**
 * Converts a Readable Stream to a string.
 * @param stream - Input stream
 * @returns Promise resolving to the string content
 */
export default async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', chunk => (data += chunk));
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });
}
