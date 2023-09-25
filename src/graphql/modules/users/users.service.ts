import { GraphQLError } from 'graphql';
import { Forum } from '../forums/models/forum';
import { ParsedForum } from '../forums/models/parsed-forum';
import { parseForums } from '../forums/utils/parseForums';
import { writeItems } from '../../utils/writeItems';
import { JoinForumInput } from './models/join-forum-input';
import { User } from './models/user';
import path from 'path';

export class UsersService {
  static async joinForum(
    { joinForumInput }: JoinForumInput,
    creator: User | null,
  ): Promise<Forum> {
    // to join a forum there should be a logged user
    if (!creator) {
      throw new GraphQLError("You're not logged in!", {
        extensions: { code: 401 },
      });
    }

    const forums = parseForums();

    const forumToBeJoined = parseForums().find(
      (forum) => forum.id === joinForumInput.forumId,
    );

    if (!forumToBeJoined) {
      throw new GraphQLError('Forum not found!', { extensions: { code: 404 } });
    }

    const shouldAddNewId = !forumToBeJoined.users.find(
      (item) => item.id === creator.id,
    );

    // check if the user is a member of the forum
    if (!shouldAddNewId) {
      throw new GraphQLError("You're already a member of this forum!", {
        extensions: { code: 403 },
      });
    }

    forumToBeJoined.users.push(creator);

    const untouchedForums = forums
      .filter((item) => item.id !== joinForumInput.forumId)
      .map((forum) => ({
        id: forum.id,
        isPrivate: forum.isPrivate,
        messageIds: forum.messages.map((item) => item.id),
        title: forum.title,
        userIds: forum.users.map((item) => item.id),
      }));

    const parsedForumToBeJoined: ParsedForum = {
      id: forumToBeJoined.id,
      isPrivate: forumToBeJoined.isPrivate,
      messageIds: forumToBeJoined.messages.map((item) => item.id),
      title: forumToBeJoined.title,
      userIds: forumToBeJoined.users.map((item) => item.id),
    };

    writeItems<ParsedForum>(
      [...untouchedForums, parsedForumToBeJoined],
      path.join(__dirname, '../forums/fixtures/forums.fixture.json'),
    );

    return forumToBeJoined;
  }
}
