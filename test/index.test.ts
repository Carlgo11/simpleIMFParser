import { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import assert from 'node:assert';
import parseEmail from '../src/index.js';
import { Readable } from 'node:stream';

describe('simpleIMFParser', () => {
  const date = `${(new Date(faker.date.recent())).toUTCString().slice(0, -4)} -0000`;

  it('Should parse valid message (string)', async () => {
    const headers: Record<string, string> = {
      'Subject': faker.lorem.sentence(9),
      'Message-ID': `<${faker.string.uuid()}@${faker.internet.domainName()}>`,
      'from': `"${faker.person.fullName()}" <${faker.internet.email()}>`,
      'To': `${faker.person.fullName()} <${faker.internet.email()}>`,
      'Date': date,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    const body = faker.lorem.paragraphs(5, '\r\n');
    const email = await parseEmail(`${headersString}\r\n\r\n${body}`, {
      id: headers['Message-ID'].slice(1, -1),
      to: [headers['To'].split('<')[1].slice(0, -1)],
      from: headers['from'].split('<')[1].slice(0, -1),
      sender: {
        rDNS: faker.internet.domainName(),
        helo: `[${faker.internet.ipv4()}]`,
        tls: true
      }
    });
    // console.log(email.toString())
    assert.ok(email.toString());
  });

  it('Should parse valid message (stream)', async () => {
    const headers: Record<string, string> = {
      'from': `"${faker.person.fullName()}" <${faker.internet.email()}>`,
      'To': `${faker.person.fullName()} <${faker.internet.email({ allowSpecialCharacters: true })}>`,
      'Subject': faker.lorem.sentence(),
      'MESSAGE-ID': `<${faker.string.uuid()}@${faker.internet.domainName()}>`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    const body = faker.lorem.paragraphs(5, '\r\n');

    const full_email = `${headersString}\r\n\r\n${body}`;

    const email = await parseEmail(Readable.from(full_email), {});
    assert.ok(email.toString());
  });
});
