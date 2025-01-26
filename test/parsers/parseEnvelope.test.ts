import { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import assert from 'node:assert';
import parseEnvelope from '../../src/parsers/parseEnvelope.js';

describe('Parse Envelope', () => {
  it('Test HELO', async () => {
    const envelope = {
      sender: {
        helo: `[${faker.internet.ipv4()}]`,
      },
    };
    assert.ok(await parseEnvelope(envelope));

    envelope.sender.helo = `[IPv6:${faker.internet.ipv6()}]`;
    assert.ok(await parseEnvelope(envelope));

    envelope.sender.helo = faker.internet.domainName();
    assert.ok(await parseEnvelope(envelope));

    envelope.sender.helo = faker.internet.ip();
    await assert.rejects(async () => parseEnvelope(envelope));
  });

  it('Test rDNS', async () => {
    const envelope = {
      sender: {
        rDNS: faker.internet.domainName(),
      },
    };
    assert.ok(await parseEnvelope(envelope));

    envelope.sender.rDNS = faker.internet.ip();
    await assert.rejects(async () => parseEnvelope(envelope));

    envelope.sender.rDNS = faker.internet.domainName().split('.')[0];
    await assert.rejects(async () => parseEnvelope(envelope));
  });

  it('Test MAIL FROM', async () => {
    const envelope = {
      from: faker.internet.email(),
    };
    assert.ok(await parseEnvelope(envelope));

    // Reject random data
    envelope.from = faker.string.alpha(10);
    await assert.rejects(async () => parseEnvelope(envelope));

    // Reject address without local part
    envelope.from = faker.internet.email().split('@')[1];
    await assert.rejects(async () => parseEnvelope(envelope));

    // Reject address without domain
    envelope.from = faker.internet.email().split('@')[0];
    await assert.rejects(async () => parseEnvelope(envelope));
  });

  it('Test RCPT TO', async () => {
    const envelope = {
      to: [faker.internet.email()],
    };
    assert.ok(await parseEnvelope(envelope));

    // @ts-ignore
    envelope.to = faker.internet.email();
    await assert.rejects(async () => parseEnvelope(envelope));
  });

  it('Test Message-ID', async () => {
    // Accept normal email address
    const envelope = {
      id: `${faker.internet.email()}`,
    };
    assert.ok(await parseEnvelope(envelope));

    // Accept UUID
    envelope.id = `${faker.string.uuid()}@${faker.internet.domainName()}`;
    assert.ok(await parseEnvelope(envelope));

    // Accept random number
    envelope.id = `${faker.string.numeric({ length: { min: 10, max: 32 } })}@${faker.internet.domainName()}`;
    assert.ok(await parseEnvelope(envelope));

    // Reject <> enclosed address
    envelope.id = `<${faker.internet.email()}>`;
    await assert.rejects(async () => parseEnvelope(envelope));

    // Reject address without local part
    envelope.id = `@${faker.internet.domainName()}`;
    await assert.rejects(async () => parseEnvelope(envelope));

  });
});