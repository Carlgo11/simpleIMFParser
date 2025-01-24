"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseMessage;
const node_stream_1 = require("node:stream");
const parseHeaders_1 = __importDefault(require("./parseHeaders"));
const streamToString_1 = __importDefault(require("../utils/streamToString"));
/**
 * Parses the raw email message (headers + body).
 * @param rawData - Raw IMF email (string or stream)
 * @returns Parsed email components
 */
async function parseMessage(rawData) {
    let rawEmail;
    if (typeof rawData === 'string') {
        rawEmail = rawData;
    }
    else if (rawData instanceof node_stream_1.Readable) {
        rawEmail = await (0, streamToString_1.default)(rawData);
    }
    else {
        throw new TypeError('Invalid rawData type. Expected a string or a Readable stream.');
    }
    const headerBoundary = rawEmail.indexOf('\r\n\r\n');
    const rawHeaders = rawEmail.slice(0, headerBoundary);
    const body = rawEmail.slice(headerBoundary + 4);
    if (body.length === 0) {
        throw new Error('Header and Body must be separated by \\r\\n\\r\\n');
    }
    return {
        headers: (0, parseHeaders_1.default)(rawHeaders),
        body,
    };
}
