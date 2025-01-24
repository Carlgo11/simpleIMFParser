"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseHeaders;
/**
 * Parses headers from a raw IMF header string.
 * @param rawHeaders - The raw headers as a string
 * @returns A dictionary of headers (handling duplicates)
 */
function parseHeaders(rawHeaders) {
    const headers = {};
    const lines = rawHeaders.split(/\r\n|\n/);
    let currentKey = null;
    let currentValue = '';
    for (const line of lines) {
        if (line.startsWith(' ') || line.startsWith('\t')) {
            // Handle folded headers (continuation lines)
            if (currentKey) {
                if (Array.isArray(headers[currentKey])) {
                    headers[currentKey][headers[currentKey].length - 1] += ' ' + line.trim();
                }
                else {
                    headers[currentKey] += ' ' + line.trim();
                }
            }
            else {
                throw new Error('Header folding found without a preceding header field.');
            }
        }
        else {
            // Store previous header before starting a new one
            if (currentKey) {
                if (headers[currentKey]) {
                    if (Array.isArray(headers[currentKey])) {
                        headers[currentKey].push(currentValue);
                    }
                    else {
                        headers[currentKey] = [headers[currentKey], currentValue];
                    }
                }
                else {
                    headers[currentKey] = currentValue;
                }
            }
            // Extract new header key-value pair
            const match = line.match(/^([!#$%&'*+\-.0-9A-Z^_`a-z|~]+):\s*(.*)$/);
            if (!match) {
                throw new Error(`Invalid header format: "${line}"`);
            }
            currentKey = match[1].toLowerCase(); // Convert key to lowercase
            currentValue = match[2];
        }
    }
    // Store the last header
    if (currentKey) {
        if (headers[currentKey]) {
            if (Array.isArray(headers[currentKey])) {
                headers[currentKey].push(currentValue);
            }
            else {
                headers[currentKey] = [headers[currentKey], currentValue];
            }
        }
        else {
            headers[currentKey] = currentValue;
        }
    }
    return headers;
}
