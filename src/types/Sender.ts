export default interface Sender {
  ip: string;
  rDNS?: string;
  helo?: string;
  tls: boolean;
  authenticated?: {
    method: string;
    username?: string;
  };
}