import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { Forum } from '../forums/models/forum';
import { ParsedForum } from '../forums/models/parsed-forum';
import { parseForums } from '../forums/utils/parseForums';
import { writeItems } from '../../utils/writeItems';
import { JoinForumInput } from './models/join-forum-input';
import { User } from './models/user';
import { AuthResponse } from './models/auth-response';
import { LoginInput } from './models/auth-input';
import { RegisterInput } from './models/auth-input';
import { 
  comparePasswords, 
  generateToken, 
  hashPassword 
} from './utils/auth.utils';
import path from 'path';

// Mock users database
const USERS_FILE_PATH = path.join(__dirname, './fixtures/users.fixture.json');

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

  // Helper method to get all users
  private static getUsers(): User[] {
    try {
      const users = require(USERS_FILE_PATH);
      return users;
    } catch (error) {
      // If file doesn't exist or has invalid format, return empty array
      return [];
    }
  }

  // Helper method to save users
  private static saveUsers(users: User[]): void {
    writeItems<User>(users, USERS_FILE_PATH);
  }

  // Find user by email
  private static findUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  // Login user
  static async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const user = this.findUserByEmail(email);
    
    if (!user) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 401 },
      });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 401 },
      });
    }

    const token = generateToken(user);
    
    return {
      token,
      user: {
        ...user,
        password: '' // Don't send password to client
      } as User
    };
  }

  // Register user
  static async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, fullName, profileImageUrl } = input;
    
    // Check if user already exists
    if (this.findUserByEmail(email)) {
      throw new GraphQLError('User with this email already exists', {
        extensions: { code: 400 },
      });
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      fullName,
      profileImageUrl: profileImageUrl || 'https://via.placeholder.com/150',
    };

    // Save user
    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    // Generate token
    const token = generateToken(newUser);

    return {
      token,
      user: {
        ...newUser,
        password: '' // Don't send password to client
      } as User
    };
  }
}