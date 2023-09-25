import { User } from '../modules/users/models/user';

export type Context = {
  loggedUser: User | null;
};
