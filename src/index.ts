import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './graphql';
import { parseLoggedUser } from './graphql/modules/users/utils/parseLoggedUser';

const bootstrap = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      return {
        loggedUser: parseLoggedUser(),
      };
    },
  });

  console.log('🚀 🚀 🚀 Server started at ${url} 🚀 🚀 🚀');
};

bootstrap();
