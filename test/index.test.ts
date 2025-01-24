import { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import assert from 'node:assert';
import parseEmail from '../src';
import { Readable } from 'node:stream';

describe('simpleIMFParser', () => {
  it('Should parse valid message (string)', async () => {
    const headers: Record<string, string> = {
      'Subject': faker.lorem.sentence(),
      'MESSAGE-ID': `${faker.string.uuid()}@${faker.internet.domainName()}`,
      'from': `"${faker.person.fullName()}" <${faker.internet.email()}>`,
      'To': `${faker.person.fullName()} <${faker.internet.email()}>`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    const body = faker.lorem.paragraphs(5, '\r\n');

    const full_email = `${headersString}\r\n\r\n${body}`;
    const email = await parseEmail(full_email, {});
    assert.ok(email.toString());
  });

   it('Should parse valid message (stream)', async () => {
    const headers: Record<string, string> = {
      'from': `"${faker.person.fullName()}" <${faker.internet.email()}>`,
      'To': `${faker.person.fullName()} <${faker.internet.email({allowSpecialCharacters: true})}>`,
      'Subject': faker.lorem.sentence(),
      'MESSAGE-ID': `${faker.string.uuid()}@${faker.internet.domainName()}`,
    };
    const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    const body = faker.lorem.paragraphs(5, '\r\n');

    const full_email = `${headersString}\r\n\r\n${body}`;

    const email = await parseEmail(Readable.from(full_email), {});
    assert.ok(email.toString());
  });


});