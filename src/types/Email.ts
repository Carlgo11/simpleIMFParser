import Envelope from './Envelope.js';
import Attachment from './Attachment.js';

/**
 * Represents an email message with an envelope, headers, body, and optional attachments.
 *
 * @class Email
 * @module Email
 * @since 0.0.1
 */
export default class Email {
  /**
   * The envelope containing sender and recipient details.
   *
   * @type {Envelope}
   * @since 0.0.1
   */
  envelope: Envelope;

  /**
   * The headers of the email, stored as key-value pairs.
   * Header names are case-insensitive.
   *
   * @type {Record<string, string | string[]>}
   * @since 0.0.1
   */
  headers: Record<string, string | string[]>;

  /**
   * The plain text body of the email.
   *
   * @type {string}
   * @since 0.0.1
   */
  body: string;

  /**
   * The attachments associated with the email.
   * Defaults to an empty array if not provided.
   *
   * @type {Attachment[]}
   * @since 0.0.1
   */
  attachments?: Attachment[];

  /**
   * Creates a new email instance.
   *
   * @param {Envelope} envelope - The envelope containing sender and recipient details.
   * @param {Record<string, string | string[]>} headers - The headers of the email.
   * @param {string} body - The plain text body of the email.
   * @param {Attachment[]} [attachments=[]] - Optional attachments for the email.
   * @since 0.0.1
   */
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
   * Retrieves a header value by name (case-insensitive).
   *
   * @param {string} name - The name of the header to retrieve.
   * @returns {string | string[] | undefined} The header value, or `undefined` if not found.
   * @example
   * const email = new Email(envelope, { 'subject': 'Subject String' });
   * console.log(email.getHeader('Subject')); // Output: 'Subject String'
   * @since 0.0.1
   */
  getHeader(name: string): string | string[] | undefined {
    return this.headers[name.toLowerCase()];
  }

  /**
   * Adds a new header or appends to an existing header.
   * If the header already exists, it is converted to an array.
   *
   * @param {string} name - The name of the header.
   * @param {string} value - The value to add to the header.
   * @example
   * const email = new Email(envelope, {}, 'Hello');
   * email.addHeader('X-Custom-Header', 'Value1');
   * email.addHeader('X-Custom-Header', 'Value2');
   * console.log(email.getHeader('X-Custom-Header')); // Output: ['Value1', 'Value2']
   * @since 0.0.1
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
   * Removes a header by name (case-insensitive).
   *
   * @param {string} name - The name of the header to remove.
   * @example
   * const email = new Email(envelope, { 'X-Test': 'value' }, 'Hello');
   * email.removeHeader('X-Test');
   * console.log(email.getHeader('X-Test')); // Output: undefined
   * @since 0.0.1
   */
  removeHeader(name: string): void {
    delete this.headers[name.toLowerCase()];
  }

  /**
   * Retrieves the body of the email.
   * If the email contains both plain text and HTML, plain text is preferred.
   *
   * @returns {string} The email body.
   * @example
   * const email = new Email(envelope, {}, 'Hello, world!');
   * console.log(email.getBody()); // Output: 'Hello, world!'
   * @since 0.0.1
   */
  getBody(): string {
    return this.body || '';
  }

  /**
   * Returns the email as a string in the IMF format.
   *
   * @returns {string} The formatted email as a string.
   * @see https://datatracker.ietf.org/doc/html/rfc5322
   * @example
   * const email = new Email(envelope, { subject: 'Test' }, 'Hello');
   * console.log(email.toString());
   * // Output:
   * // Subject: Test
   * //
   * // Hello
   * @since 0.0.1
   */
  toString(): string {
    let _headers = '';
    Object.entries(this.headers).forEach(([k, v]) => _headers += `${pascalCase(k)}: ${v}\r\n`);

    return `${_headers}\r\n\r\n${this.body}`;
  }
}

/**
 * Converts a string to Pascal case formatting.
 *
 * @param {string} str - The input string to format.
 * @returns {string} The formatted string in Pascal Case.
 * @see https://www.theserverside.com/definition/Pascal-case
 * @example
 * console.log(pascalCase('content-type')); // Output: 'Content-Type'
 * @since 0.0.2
 */
function pascalCase(str: string): string {
  return str.replace(/(\w)(\w*)/g,
    function(g0, g1, g2) {
      return g1.toUpperCase() + g2.toLowerCase();
    });
}
