import Envelope from './Envelope.js';

export class Email {
  envelope: Envelope;
  headers: Record<string, string | string[]>;
  body: string;
  attachments?: Attachment[];

  constructor(
    envelope: Envelope,
    headers: Record<string, string | string[]>,
    body: string,
    attachments?: Attachment[],
  ) {
    this.envelope = envelope;
    this.headers = headers;
    this.body = body;
    this.attachments = attachments || [];
  }

  /**
   * Get a header value (case-insensitive).
   */
  getHeader(name: string): string | string[] | undefined {
    return this.headers[name.toLowerCase()];
  }

  /**
   * Add or update a header.
   */
  addHeader(name: string, value: string): void {
    const key = name.toLowerCase();
    if (this.headers[key]) {
      if (Array.isArray(this.headers[key])) {
        (this.headers[key] as string[]).push(value);
      } else {
        this.headers[key] = [this.headers[key] as string, value];
      }
    } else {
      this.headers[key] = value;
    }
  }

  /**
   * Remove a header.
   */
  removeHeader(name: string): void {
    delete this.headers[name.toLowerCase()];
  }

  /**
   * Get the email body (prefers text, fallback to HTML).
   */
  getBody(): string {
    return this.body || '';
  }

  toString(): string {
    let _headers = ''
    Object.entries(this.headers).forEach(([k, v]) => _headers += `${camelize(k)}: ${v}\r\n`)


    return `${_headers}\r\n\r\n${this.body}`;
  }
}

function camelize(str: string):string {
  return str.replace(/(\w)(\w*)/g,
    function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
}

export interface Attachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}
