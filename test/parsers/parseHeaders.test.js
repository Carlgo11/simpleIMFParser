"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const faker_1 = require("@faker-js/faker");
const node_assert_1 = __importDefault(require("node:assert"));
const parseHeaders_1 = __importDefault(require("../../src/parsers/parseHeaders"));
(0, node_test_1.describe)('Parse Headers', () => {
    (0, node_test_1.it)('Various case header names', () => {
        const headers = {
            'subject': faker_1.faker.lorem.sentence(),
            'MESSAGE-ID': `${faker_1.faker.string.uuid()}@${faker_1.faker.internet.domainName()}`,
            'FroM': `${faker_1.faker.person.fullName()} <${faker_1.faker.internet.email()}>`,
            'to': `${faker_1.faker.person.fullName()} <${faker_1.faker.internet.email()}>`,
        };
        const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
        node_assert_1.default.ok((0, parseHeaders_1.default)(headersString));
    });
    /*
      it('Extra text after email address', async () => {
        const headers: Record<string, string> = {
          'To': `${faker.person.fullName()} <${faker.internet.email()}> ${faker.lorem.sentence()}`,
        };
        const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
        await assert.rejects(async () => parseHeaders(headersString));
      });*/
    (0, node_test_1.it)('Missing : separator.', async () => {
        await node_assert_1.default.rejects(async () => (0, parseHeaders_1.default)(`Subject ${faker_1.faker.lorem.sentence()}`));
    });
});
