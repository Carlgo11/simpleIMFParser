"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseEmail;
const Email_1 = require("./types/Email");
const parseEnvelope_1 = __importDefault(require("./parsers/parseEnvelope"));
const parseMessage_1 = __importDefault(require("./parsers/parseMessage"));
async function parseEmail(rawData, envelope) {
    const parsedEnvelope = await (0, parseEnvelope_1.default)(envelope);
    const { headers, body } = await (0, parseMessage_1.default)(rawData);
    return new Email_1.Email(parsedEnvelope, headers, body);
}
