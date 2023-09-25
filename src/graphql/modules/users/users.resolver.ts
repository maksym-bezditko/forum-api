import { Context } from '../../models';
import { Forum } from '../forums/models/forum';
import { JoinForumInput } from './models/join-forum-input';
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
  },
};
