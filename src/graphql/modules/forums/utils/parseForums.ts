import fs from 'fs';
import path from 'path';
import { Forum } from '../models/forum';
import { ParsedForum } from '../models/parsed-forum';
import { parseUsers } from '../../users/utils/parseUsers';
import { parseMessages } from '../../messages/utils/parseMessages';

export const parseForums = (): Forum[] => {
  try {
    const parsedData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../forums/fixtures/forums.fixture.json'),
        'utf8',
      ),
    ) as ParsedForum[];

    const users = parseUsers();

    const messages = parseMessages();

    return parsedData.map(({ id, isPrivate, messageIds, title, userIds }) => ({
      id,
      isPrivate,
      messages: messages.filter(({ id }) => messageIds.includes(id)),
      title,
      users: users.filter(({ id }) => userIds.includes(id)),
    }));
  } catch (err) {
    console.error('Error reading file:', err);

    return [];
  }
};
