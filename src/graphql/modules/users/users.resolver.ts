import { Context } from '../../models';
import { Forum } from '../forums/models/forum';
import { JoinForumInput } from './models/join-forum-input';
import { LoginInput, RegisterInput } from './models/auth-input';
import { AuthResponse } from './models/auth-response';
import { UsersService } from './users.service';

export const usersResolver = {
  Mutation: {
    async joinForum(
      _: unknown,
      args: JoinForumInput,
      context: Context,
    ): Promise<Forum> {
      return UsersService.joinForum(args, context.loggedUser);
    },
    
    async login(
      _: unknown,
      { email, password }: { email: string; password: string },
    ): Promise<AuthResponse> {
      return UsersService.login({ email, password });
    },

    async register(
      _: unknown,
      { input }: { input: RegisterInput },
    ): Promise<AuthResponse> {
      return UsersService.register(input);
    },
  },
};