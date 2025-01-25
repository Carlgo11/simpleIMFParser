import Sender from './Sender.js';

export default interface Envelope {
  id: string;
  from: string;
  to: string[];
  receivedTime: Date;
  sender: Sender;
}