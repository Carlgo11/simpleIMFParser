import Sender from './Sender';

export default interface Envelope {
  id: string;
  from: string;
  to: string[];
  receivedTime: Date;
  sender: Sender;
}