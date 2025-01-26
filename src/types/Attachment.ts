/**
 * Represents an email attachment.
 *
 * This interface defines the structure of an attachment, including
 * its filename, MIME type, size, and content.
 *
 * @interface Attachment
 * @since 0.0.1
 */
export default interface Attachment {
  /**
   * The name of the attachment file.
   *
   * This is the filename as provided in the email message.
   *
   * @type {string}
   * @example "invoice.pdf"
   * @example "image.png"
   * @since 0.0.1
   */
  filename: string;

  /**
   * The MIME type of the attachment.
   *
   * This indicates the media type of the file, as specified in the `Content-Type` header.
   *
   * @type {string}
   * @example "application/pdf"
   * @example "image/jpeg"
   * @example "text/plain"
   * @since 0.0.1
   */
  contentType: string;

  /**
   * The size of the attachment in bytes.
   *
   * Represents the total number of bytes in the attachment content.
   *
   * @type {number}
   * @example 102400  // 100 KB
   * @example 512     // 512 bytes
   * @since 0.0.1
   */
  size: number;

  /**
   * The content of the attachment.
   *
   * This contains the actual file data as written in the email message.
   *
   * @type {string}
   * @example /9j/4AAQSkZJRgABAQEAEQARAAD/2wB //JPEG example
   * @since 0.0.1
   */
  content: string;
}
