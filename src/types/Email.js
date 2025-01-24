"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    envelope;
    headers;
    body;
    attachments;
    constructor(envelope, headers, body, attachments) {
        this.envelope = envelope;
        this.headers = headers;
        this.body = body;
        this.attachments = attachments || [];
    }
    /**
     * Get a header value (case-insensitive).
     */
    getHeader(name) {
        return this.headers[name.toLowerCase()];
    }
    /**
     * Add or update a header.
     */
    addHeader(name, value) {
        const key = name.toLowerCase();
        if (this.headers[key]) {
            if (Array.isArray(this.headers[key])) {
                this.headers[key].push(value);
            }
            else {
                this.headers[key] = [this.headers[key], value];
            }
        }
        else {
            this.headers[key] = value;
        }
    }
    /**
     * Remove a header.
     */
    removeHeader(name) {
        delete this.headers[name.toLowerCase()];
    }
    /**
     * Get the email body (prefers text, fallback to HTML).
     */
    getBody() {
        return this.body || '';
    }
    toString() {
        let _headers = '';
        Object.entries(this.headers).forEach(([k, v]) => _headers += `${camelize(k)}: ${v}\r\n`);
        return `${_headers}\r\n\r\n${this.body}`;
    }
}
exports.Email = Email;
function camelize(str) {
    return str.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
}
