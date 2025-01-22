import test, { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import assert from 'node:assert';
import parseMessage from '../../src/parsers/parseMessage';
import parseHeaders from '../../src/parsers/parseHeaders';



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
/*
  it('Extra text after email address', async () => {
    const headers: Record<string, string> = {
      'To': `${faker.person.fullName()} <${faker.internet.email()}> ${faker.lorem.sentence()}`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    await assert.rejects(async () => parseHeaders(headersString));
  });*/

  it('Missing : separator.', async () => {
    await assert.rejects(async () => parseHeaders(`Subject ${faker.lorem.sentence()}`));
  });
});