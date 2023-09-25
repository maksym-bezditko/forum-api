import { Context } from '../../models';
import { ForumsService } from './forums.service';
import { CreateForumInput } from './models/create-forum-input';
import { Forum } from './models/forum';

export const forumsResolver = {
  Query: {
    async availableForums(
      _: unknown,
      __: unknown,
      context: Context,
    ): Promise<Forum[]> {
      return ForumsService.getAvailableForums(context.loggedUser);
    },

    async joinedForums(
      _: unknown,
      __: unknown,
      context: Context,
    ): Promise<Forum[]> {
      return ForumsService.getJoinedForums(context.loggedUser);
    },

    async privateForums(): Promise<Forum[]> {
      return ForumsService.getPrivateForums();
    },

    async forum(_: unknown, args: { id: string }): Promise<Forum> {
      return ForumsService.getForumById(args.id);
    },
  },

  Mutation: {
    async createForum(
      _: unknown,
      args: CreateForumInput,
      context: Context,
    ): Promise<Forum> {
      return ForumsService.createForum(args, context.loggedUser);
    },
  },
};
