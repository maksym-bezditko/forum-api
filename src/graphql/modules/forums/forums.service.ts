import { CreateForumInput } from './models/create-forum-input';
import { Forum } from './models/forum';
import { parseForums } from './utils/parseForums';
import { v4 as uuidv4 } from 'uuid';
import { writeItems } from '../../utils/writeItems';
import { User } from '../users/models/user';
import { GraphQLError } from 'graphql';
import path from 'path';
import { ParsedForum } from './models/parsed-forum';

export class ForumsService {
  static async getAvailableForums(loggedUser: User | null): Promise<Forum[]> {
    if (!loggedUser) {
      throw new GraphQLError("You're not logged in!", {
        extensions: { code: 401 },
      });
    }

    return parseForums().filter(({ isPrivate, users }) => {
      const isLoggedUserMember = users
        .map((item) => item.id)
        .includes(loggedUser?.id);

      return !isLoggedUserMember && !isPrivate;
    });
  }

  static async getPrivateForums(): Promise<Forum[]> {
    return parseForums().filter(({ isPrivate }) => isPrivate);
  }

  static async getJoinedForums(loggedUser: User | null): Promise<Forum[]> {
    if (!loggedUser) {
      throw new GraphQLError("You're not logged in!", {
        extensions: { code: 401 },
      });
    }

    console.log(parseForums());

    return parseForums().filter(({ users }) =>
      users.map((item) => item.id).includes(loggedUser?.id),
    );
  }

  static async getForumById(forumId: string): Promise<Forum> {
    const result = parseForums().find(({ id }) => forumId === id);

    if (!result) {
      throw new GraphQLError('Forum not found!', { extensions: { code: 404 } });
    }

    return result;
  }

  static async createForum(
    { createForumInput }: CreateForumInput,
    creator: User | null,
  ): Promise<Forum> {
    // to create a forum there should be a logged user
    if (!creator) {
      throw new GraphQLError("You're not logged in!", {
        extensions: { code: 401 },
      });
    }

    const currentState = parseForums();

    const newForum: Forum = {
      ...createForumInput,
      id: uuidv4(),
      messages: [],
      users: [creator],
    };

    currentState.push(newForum);

    // update the forums
    writeItems<ParsedForum>(
      currentState.map(({ id, isPrivate, messages, title, users }) => ({
        id,
        isPrivate,
        messageIds: messages.map((item) => item.id),
        title,
        userIds: users.map((item) => item.id),
      })),
      path.join(__dirname, '../forums/fixtures/forums.fixture.json'),
    );

    return newForum;
  }
}
