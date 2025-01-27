import { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import assert from 'node:assert';
import parseHeaders from '../../src/parsers/parseHeaders.js';

describe('Parse Headers', () => {
  it('Various case header names', () => {
    const headers: Record<string, string> = {
      'subject': faker.lorem.sentence(),
      'MESSAGE-ID': `<${faker.string.uuid()}@${faker.internet.domainName()}>`,
      'FroM': `${faker.person.fullName()} <${faker.internet.email()}>`,
      'to': `${faker.person.fullName()} <${faker.internet.email()}>`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    assert.ok(parseHeaders(headersString, 'strict'));
  });

  it('Rejects invalid header values', async () => {
    const date = faker.date.recent();
    await Promise.all([
      assert.rejects(async () => parseHeaders(`Date: ${date}`, 'strict')),
      assert.rejects(async () => parseHeaders(`Date: ${new Date(date).toUTCString()}`, 'strict')),
      assert.rejects(async () => parseHeaders('MIME-Version: 1.0 ', 'strict')),
      assert.rejects(async () => parseHeaders(`In-Reply-To: "${faker.person.fullName()}" <${faker.internet.email()}>`, 'strict')),
      assert.rejects(async () => parseHeaders(`Subject ${faker.lorem.sentence()}`, 'strict')),
      assert.rejects(async () => parseHeaders('Subject    : Test', 'strict')),
    ]);
  });
});