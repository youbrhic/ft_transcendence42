export interface Message {
  id: string | number;
  senderId: number;
  recipientId: number;
  text: string;
  timestamp: string;
}
