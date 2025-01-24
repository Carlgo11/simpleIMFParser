"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = streamToString;
/**
 * Converts a Readable Stream to a string.
 * @param stream - Input stream
 * @returns Promise resolving to the string content
 */
async function streamToString(stream) {
    return new Promise((resolve, reject) => {
        let data = '';
        stream.on('data', chunk => (data += chunk));
        stream.on('end', () => resolve(data));
        stream.on('error', reject);
    });
}
