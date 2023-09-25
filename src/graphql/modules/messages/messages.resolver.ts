import { Context } from '../../models';
import { MessagesService } from './messages.service';
import { Message } from './models/message';
import { PostMessageInput } from './models/post-message-input';

export const messagesResolver = {
  Mutation: {
    async postMessage(
      _: unknown,
      args: PostMessageInput,
      context: Context,
    ): Promise<Message> {
      return MessagesService.postMessage(args, context.loggedUser);
    },
  },
};
