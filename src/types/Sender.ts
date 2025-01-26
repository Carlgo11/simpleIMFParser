/**
 * Represents details about the sender of an email during the SMTP transaction.
 *
 * This interface includes metadata about the sender's connection, such as
 * the originating IP address, reverse DNS, HELO/EHLO value, TLS status,
 * and authentication details (if applicable).
 *
 * @interface Sender
 * @since 0.0.1
 */
export default interface Sender {
  /**
   * The IP address of the sender.
   *
   * This is the IP address of the SMTP client that initiated the connection.
   *
   * @type {string}
   * @example "192.168.1.100"
   * @example "2001:db8::1"
   * @since 0.0.1
   */
  ip: string;

  /**
   * The reverse DNS (rDNS) hostname of the sender.
   *
   * If available, this represents the resolved hostname of the sender's IP.
   * This value may be `undefined` if no rDNS record exists.
   *
   * @type {string | undefined}
   * @example "mail.example.com"
   * @since 0.0.1
   */
  rDNS?: string;

  /**
   * The HELO/EHLO value provided by the SMTP client.
   *
   * This is the argument sent by the client in the EHLO or HELO command.
   * It is typically a hostname but may also be an IP address.
   * If the value is an IP address, it is enclosed in square brackets.
   *
   * @type {string | undefined}
   * @example "mail.example.com"
   * @example "[192.168.1.100]"
   * @example "[IPv6:2001:db8::1]"
   * @since 0.0.1
   */
  helo?: string;

  /**
   * Indicates whether the connection was secured using TLS (STARTTLS).
   *
   * A `true` value means that the SMTP session was encrypted using TLS (STARTTLS).
   *
   * @type {boolean}
   * @example true
   * @example false
   * @since 0.0.1
   */
  tls: boolean;

  /**
   * Authentication details if the sender authenticated.
   *
   * This property exists only if the sender used SMTP authentication.
   *
   * @type {Object | undefined}
   * @property {string} method - The authentication method used (e.g., "PLAIN", "LOGIN", "CRAM-MD5").
   * @property {string | undefined} username - The authenticated username, if available.
   * @example { method: "PLAIN", username: "user@example.com" }
   * @since 0.0.1
   */
  authenticated?: {
    method: string;
    username?: string;
  };
}
