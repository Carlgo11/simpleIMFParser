"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const faker_1 = require("@faker-js/faker");
const node_assert_1 = __importDefault(require("node:assert"));
const parseMessage_1 = __importDefault(require("../../src/parsers/parseMessage"));
(0, node_test_1.describe)('Parse Message', () => {
    (0, node_test_1.it)('Should parse valid message', async () => {
        const headers = {
            'Subject': faker_1.faker.lorem.sentence(),
            'Message-ID': `${faker_1.faker.string.uuid()}@${faker_1.faker.internet.domainName()}`,
            'From': `"${faker_1.faker.person.fullName()}" <${faker_1.faker.internet.email()}>`,
            'To': `${faker_1.faker.person.fullName()} <${faker_1.faker.internet.email()}>`,
        };
        const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
        const body = faker_1.faker.lorem.paragraphs(5).replace('\n', '\r\n');
        const full_email = `${headersString}\r\n\r\n${body}`;
        node_assert_1.default.ok(await (0, parseMessage_1.default)(full_email));
    });
    (0, node_test_1.it)('Should reject invalid message divider', async () => {
        const headers = {
            'Subject': faker_1.faker.lorem.sentence(),
            'Message-ID': `${faker_1.faker.string.uuid()}@${faker_1.faker.internet.domainName()}`,
            'From': `${faker_1.faker.person.fullName()} <${faker_1.faker.internet.email()}>`,
            'To': `${faker_1.faker.person.fullName()} <${faker_1.faker.internet.email()}>`,
        };
        const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
        const body = faker_1.faker.lorem.paragraphs(5).replace('\n', '\r\n');
        const full_email = `${headersString}\r\n${body}`;
        await node_assert_1.default.rejects(() => (0, parseMessage_1.default)(full_email));
    });
});
