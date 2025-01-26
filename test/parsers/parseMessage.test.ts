import { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import assert from 'node:assert';
import parseMessage from '../../src/parsers/parseMessage.js';

describe('Parse Message', () => {
  it('Should parse valid message', async () => {
    const headers: Record<string, string> = {
      'Subject': faker.lorem.sentence(),
      'Message-ID': `${faker.string.uuid()}@${faker.internet.domainName()}`,
      'From': `"${faker.person.fullName()}" <${faker.internet.email()}>`,
      'To': `${faker.person.fullName()} <${faker.internet.email()}>`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    const body = faker.lorem.paragraphs(5).replace('\n', '\r\n');

    const full_email = `${headersString}\r\n\r\n${body}`;
    assert.ok(await parseMessage(full_email));
  });

  it('Should reject invalid message divider', async () => {
    const headers: Record<string, string> = {
      'Subject': faker.lorem.sentence(),
      'Message-ID': `${faker.string.uuid()}@${faker.internet.domainName()}`,
      'From': `${faker.person.fullName()} <${faker.internet.email()}>`,
      'To': `${faker.person.fullName()} <${faker.internet.email()}>`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    const body = faker.lorem.paragraphs(5).replace('\n', '\r\n');

    const full_email = `${headersString}\r\n${body}`;
    await assert.rejects(() => parseMessage(full_email));
  });
});