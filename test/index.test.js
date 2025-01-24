"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const faker_1 = require("@faker-js/faker");
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = __importDefault(require("../src"));
const node_stream_1 = require("node:stream");
(0, node_test_1.describe)('simpleIMFParser', () => {
    (0, node_test_1.it)('Should parse valid message (string)', async () => {
        const headers = {
            'Subject': faker_1.faker.lorem.sentence(),
            'MESSAGE-ID': `${faker_1.faker.string.uuid()}@${faker_1.faker.internet.domainName()}`,
            'from': `"${faker_1.faker.person.fullName()}" <${faker_1.faker.internet.email()}>`,
            'To': `${faker_1.faker.person.fullName()} <${faker_1.faker.internet.email()}>`,
        };
        const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
        const body = faker_1.faker.lorem.paragraphs(5, '\r\n');
        const full_email = `${headersString}\r\n\r\n${body}`;
        const email = await (0, src_1.default)(full_email, {});
        node_assert_1.default.ok(email.toString());
    });
    (0, node_test_1.it)('Should parse valid message (stream)', async () => {
        const headers = {
            'from': `"${faker_1.faker.person.fullName()}" <${faker_1.faker.internet.email()}>`,
            'To': `${faker_1.faker.person.fullName()} <${faker_1.faker.internet.email({ allowSpecialCharacters: true })}>`,
            'Subject': faker_1.faker.lorem.sentence(),
            'MESSAGE-ID': `${faker_1.faker.string.uuid()}@${faker_1.faker.internet.domainName()}`,
        };
        const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
        const body = faker_1.faker.lorem.paragraphs(5, '\r\n');
        const full_email = `${headersString}\r\n\r\n${body}`;
        const email = await (0, src_1.default)(node_stream_1.Readable.from(full_email), {});
        node_assert_1.default.ok(email.toString());
    });
});
