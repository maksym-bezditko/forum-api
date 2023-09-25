import { User } from '../../users/models/user';

export type Message = {
  id: string;
  author: User;
  text: string;
  createdAt: string;
};
