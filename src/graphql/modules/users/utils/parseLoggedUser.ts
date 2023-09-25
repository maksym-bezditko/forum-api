import fs from 'fs';
import path from 'path';
import { User } from '../models/user';

export const parseLoggedUser = (): User | null => {
  try {
    const parsedData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../users/fixtures/logged-user.fixture.json'),
        'utf8',
      ),
    ) as User;

    return parsedData;
  } catch (err) {
    console.error('Error reading file:', err);

    return null;
  }
};
