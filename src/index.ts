import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './graphql';
import { getUserFromToken, parseLoggedUser } from './graphql/modules/users/utils/parseLoggedUser';

const bootstrap = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      // Get the authorization header
      const auth = req.headers.authorization || '';
      
      // If no auth header, fall back to fixture-based login for backwards compatibility
      if (!auth) {
        return {
          loggedUser: parseLoggedUser(),
        };
      }
      
      // Extract the token from the Authorization header (Bearer token)
      const token = auth.split(' ')[1]; 
      
      // Get the user from the token
      const user = getUserFromToken(token);
      
      return {
        loggedUser: user,
      };
    },
  });

  console.log(`🚀 🚀 🚀 Server started at ${url} 🚀 🚀 🚀`);
};

bootstrap();