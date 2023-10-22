import { Timestamp } from "firebase/firestore";

export type User = {
  id?: string;
  name: string;
  avatarUrl: string;
  balance: number;
};

export type Transaction = {
  id?: string;
  senderId: string;
  receiverId: string;
  amount: number;
  date: Timestamp;
};
