import { Message } from '../../messages/models/message';
import { User } from '../../users/models/user';

export type Forum = {
  id: string;
  title: string;
  users: User[];
  isPrivate: boolean;
  messages: Message[];
};
