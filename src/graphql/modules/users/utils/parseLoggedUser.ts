import fs from 'fs';
import path from 'path';
import { User } from '../models/user';
import { verifyToken } from './auth.utils';

// Legacy method - will be removed once authentication is fully integrated
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

// New method to authenticate a user from a token
export const getUserFromToken = (token: string | undefined): User | null => {
  if (!token) {
    return null;
  }

  try {
    // Verify and decode the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Get the user from the database
    const users = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../users/fixtures/users.fixture.json'),
        'utf8',
      ),
    ) as User[];

    const user = users.find(user => user.id === decoded.id);
    
    if (!user) {
      return null;
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, password: '' } as User;
  } catch (err) {
    console.error('Error authenticating user:', err);
    return null;
  }
};