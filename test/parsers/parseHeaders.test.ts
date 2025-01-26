import test, { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import assert from 'node:assert';
import parseMessage from '../../src/parsers/parseMessage.js';
import parseHeaders from '../../src/parsers/parseHeaders.js';



describe('Parse Headers', () => {
  it('Various case header names', () => {
    const headers: Record<string, string> = {
      'subject': faker.lorem.sentence(),
      'MESSAGE-ID': `${faker.string.uuid()}@${faker.internet.domainName()}`,
      'FroM': `${faker.person.fullName()} <${faker.internet.email()}>`,
      'to': `${faker.person.fullName()} <${faker.internet.email()}>`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    assert.ok(parseHeaders(headersString));
  });

  it('Rejects Folding white space between field name and colon', () => {
    const headers = 'Subject    : Test';
    assert.rejects(async () => parseHeaders(headers));
  });

  it('Rejects Missing : separator.', () => {
    assert.rejects(async () => parseHeaders(`Subject ${faker.lorem.sentence()}`));
  });
});