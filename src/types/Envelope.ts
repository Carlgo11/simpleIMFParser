import Sender from './Sender.js';

/**
 * Represents an email envelope, containing metadata about the sender, recipients, and delivery.
 *
 * The envelope is part of the message delivery process and includes information
 * such as the sender, recipient list, and timestamps.
 *
 * @interface Envelope
 * @since 0.0.1
 */
export default interface Envelope {
  /**
   * A unique identifier for the email.
   * This can be set either by the sender using Message-ID, or by the recipient server.
   *
   * @type {string}
   * @since 0.0.1
   */
  id: string;

  /**
   * The sender's "MAIL FROM" email address.
   *
   * Note: This address may differ from the address used in the "From"-header inside the email message.
   *
   * @type {string}
   * @since 0.0.1
   */
  from: string;

  /**
   * The list of recipient email addresses.
   *
   * @type {string[]}
   * @since 0.0.1
   */
  to: string[];

  /**
   * The sender details, including additional metadata about the sender.
   *
   * @type {Sender}
   * @see Sender
   * @since 0.0.1
   */
  sender: Sender;
}
