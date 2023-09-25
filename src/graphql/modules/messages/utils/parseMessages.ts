import fs from 'fs';
import path from 'path';
import { parseUsers } from '../../users/utils/parseUsers';
import { Message } from '../models/message';
import { ParsedMessage } from '../models/parsed-message';

export const parseMessages = (): Message[] => {
  try {
    const parsedData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../messages/fixtures/messages.fixture.json'),
        'utf8',
      ),
    ) as ParsedMessage[];

    return parsedData.map(({ authorId, id, createdAt, text }) => ({
      id,
      text,
      author: parseUsers().find(({ id }) => id === authorId)!,
      createdAt,
    }));
  } catch (err) {
    console.error('Error reading file:', err);

    return [];
  }
};
