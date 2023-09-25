import { forumsResolver } from './modules/forums/forums.resolver';
import { readFileSync } from 'fs';
import path from 'path';
import { messagesResolver } from './modules/messages/messages.resolver';
import { usersResolver } from './modules/users/users.resolver';

const usersTypeDefs = readFileSync(
  path.join(__dirname, 'modules/users/user.graphql'),
  {
    encoding: 'utf-8',
  },
);

const forumsTypeDefs = readFileSync(
  path.join(__dirname, 'modules/forums/forum.graphql'),
  {
    encoding: 'utf-8',
  },
);

const messagesTypeDefs = readFileSync(
  path.join(__dirname, 'modules/messages/message.graphql'),
  {
    encoding: 'utf-8',
  },
);

export const typeDefs = `
  scalar DateTime

  ${usersTypeDefs}
  ${forumsTypeDefs}
  ${messagesTypeDefs}

  type Query {
    availableForums: [Forum!]!
    privateForums: [Forum!]!
    joinedForums: [Forum!]!
    forum(id: String!): Forum!
  }

  type Mutation {
    createForum(createForumInput: CreateForumInput!): Forum!
    postMessage(postMessageInput: PostMessageInput!): Message!
    joinForum(joinForumInput: JoinForumInput!): Forum!
  }
`;

export const resolvers = {
  Query: {
    ...forumsResolver.Query,
  },
  Mutation: {
    ...forumsResolver.Mutation,
    ...messagesResolver.Mutation,
    ...usersResolver.Mutation,
  },
};
