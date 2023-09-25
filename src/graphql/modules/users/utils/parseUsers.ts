import fs from 'fs';
import path from 'path';
import { User } from '../models/user';
import { parseLoggedUser } from './parseLoggedUser';

export const parseUsers = (): User[] => {
  try {
    const loggedUser = parseLoggedUser();

    const otherUsers = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../users/fixtures/users.fixture.json'),
        'utf8',
      ),
    );

    return [...otherUsers, loggedUser] as User[];
  } catch (err) {
    console.error('Error reading file:', err);

    return [];
  }
};
