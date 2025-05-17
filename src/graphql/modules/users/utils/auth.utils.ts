import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

// Use environment variable in production
const JWT_SECRET = 'your_jwt_secret_key';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
};

export const verifyToken = (token: string): { id: string; email: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    return null;
  }
};