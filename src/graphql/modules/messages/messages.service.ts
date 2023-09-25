import { ParsedForum } from '../forums/models/parsed-forum';
import { parseForums } from '../forums/utils/parseForums';
import { writeItems } from '../../utils/writeItems';
import { User } from '../users/models/user';
import { Message } from './models/message';
import { PostMessageInput } from './models/post-message-input';
import { v4 as uuidv4 } from 'uuid';
import { parseMessages } from './utils/parseMessages';
import { ParsedMessage } from './models/parsed-message';
import { GraphQLError } from 'graphql';
import path from 'path';

export class MessagesService {
  static async postMessage(
    { postMessageInput }: PostMessageInput,
    creator: User | null,
  ): Promise<Message> {
    // to post a message there should be a logged user

    if (!creator) {
      throw new GraphQLError("You're not logged in!", {
        extensions: { code: 401 },
      });
    }

    const forums = parseForums();

    const forumToBeUpdated = parseForums().find(
      (forum) => forum.id === postMessageInput.forumId,
    );

    if (!forumToBeUpdated) {
      throw new GraphQLError('Forum not found!', { extensions: { code: 404 } });
    }

    // check if the user is a member of the forum
    if (!forumToBeUpdated.users.map((item) => item.id).includes(creator.id)) {
      throw new GraphQLError("You're not a member of this forum!", {
        extensions: { code: 403 },
      });
    }

    const newMessage: Message = {
      id: uuidv4(),
      text: postMessageInput.text,
      author: creator,
      createdAt: new Date().toISOString(),
    };

    forumToBeUpdated.messages.push(newMessage);

    // update the forum

    const untouchedForums = forums
      .filter((item) => item.id !== postMessageInput.forumId)
      .map((forum) => ({
        id: forum.id,
        isPrivate: forum.isPrivate,
        messageIds: forum.messages.map((item) => item.id),
        title: forum.title,
        userIds: forum.users.map((item) => item.id),
      }));

    const parsedForumToBeJoined: ParsedForum = {
      id: forumToBeUpdated.id,
      isPrivate: forumToBeUpdated.isPrivate,
      messageIds: forumToBeUpdated.messages.map((item) => item.id),
      title: forumToBeUpdated.title,
      userIds: forumToBeUpdated.users.map((item) => item.id),
    };

    writeItems<ParsedForum>(
      [...untouchedForums, parsedForumToBeJoined],
      path.join(__dirname, '../forums/fixtures/forums.fixture.json'),
    );

    // update the messages
    const untouchedMessages: ParsedMessage[] = parseMessages().map(
      ({ id, createdAt, author, text }) => ({
        id,
        createdAt,
        authorId: author.id,
        text,
      }),
    );

    const parsedNewMessage: ParsedMessage = {
      id: newMessage.id,
      text: newMessage.text,
      authorId: newMessage.author.id,
      createdAt: newMessage.createdAt,
    };

    writeItems<ParsedMessage>(
      [parsedNewMessage, ...untouchedMessages],
      path.join(__dirname, '../messages/fixtures/messages.fixture.json'),
    );

    return newMessage;
  }
}
