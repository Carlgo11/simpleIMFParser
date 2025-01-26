import Envelope from '../types/Envelope.js';
import validator from 'validator';

/**
 * Parses envelope metadata from the SMTP transaction.
 * @param envelope - Envelope data object
 * @returns Parsed Envelope object
 */
export default async function parseEnvelope(envelope: Object): Promise<Envelope> {
  // @ts-ignore
  const { id, from, to, sender } = envelope;
  if (id && !validator.isEmail(id, { allow_utf8_local_part: false })) throw new Error(`Invalid Message-ID: ${id}`);
  if (from && !validator.isEmail(from)) throw new Error(`Invalid MAIL FROM address: ${from}`);

  to?.forEach((address: string) => {
    if (!validator.isEmail(address)) throw new Error(`Invalid Address: ${address}`);
  });

  if (sender?.ip && !validator.isIP(sender.ip))
    throw new Error(`Invalid Source IP Address: ${sender.ip}`);

  if (sender?.rDNS && !validator.isFQDN(sender.rDNS))
    throw new Error(`Invalid rDNS: ${sender.rDNS}`);

  const heloRegex = /^(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\[IPv6:[a-fA-F0-9:.]+]|\[\d{1,3}(?:\.\d{1,3}){3}]))$/;

  if (sender?.helo && !heloRegex.test(sender.helo))
    throw new Error(`Invalid HELO value: ${sender.helo}`);

  if(sender?.tls && typeof sender?.tls !== 'boolean')
    throw new Error(`Invalid TLS value: ${sender.tls}`);

    return envelope as Envelope;
}
