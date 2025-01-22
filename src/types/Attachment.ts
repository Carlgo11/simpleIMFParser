export default interface Attachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}