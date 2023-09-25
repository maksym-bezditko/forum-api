## Documentation for the project:

#### Notice: 

Thanks for the interesting idea, it was a pleasure to work on this. I have used `@apollo/server` package instead of `apollo-server-express` as the second is deprecated already. The first package completely replicates the functionality of the second one, so there shouldn't be any difference. 

#### How to launch the project:

1.  Make sure to navigate to the root folder of the project
2.  If node is not installed on your machine, please make sure to do it. Here is the guide: [https://nodejs.dev/en/learn/how-to-install-nodejs/](https://nodejs.dev/en/learn/how-to-install-nodejs/)
3.  Run `npm run init-and-start` command in the terminal
4.  You will see the url in the console window where the API will be available (by default it will start at [http://localhost:4000](http://localhost:4000))

#### Project description:

*   I have created separate modules to better structure the code and make it more modular. If the project were to scale, the modularity would help a lot. 
*   All the data is stored in `[module]/fixtures/[entity].fixture.json` files. 
*   Utility functions are located in `utils` folders. If a function is specific to a module, it will be within the module. If not, it will be in the top-level `utils` folder.
*   TS type definitions are located under `models` folders only. If a type definition is specific to a module, it will be within the module. If not, it will be in the top-level `models` folder.
*   GraphQL schemas, resolvers and services (a set of helper functions) are located within modules. They are always specific to a particular module.
*   `.eslintrc.js` and `.prettierrc` are files to configure ESLint and Prettier linter respectively. This will help to maintain the codebase in the future.
*   There is a separate file for the authenticated user. You can find it in `modules/users/fixtures/logged-user.fixture.json` . All actions are carried out from the name of this user. So they are the author of a message if we were to post a message and they are the first member of a forum if we were to create a forum.

**API structure:**

*   Queries:
    *   availableForums - returns all forums that are available to join (a user is currently not a member of a forum and the forum is not private).
    *   privateForums - returns all forums that are private (can be joined only using a forumId, so logically another user needs to share the id first), not listed in the available forums list.
    *   joinedForums - returns all forums the authenticated user has previously joined (both private and public can be included).
    *   forum - returns a forum with a specified forum ID
*   Mutations:
    *   createForum - creates a forum, adds the authenticated user as the first member of this forum
    *   postMessage - checks if the user is a member of the specified forum and posts a message to the forum from the name of the authenticated user
    *   joinForum - checks if the user is not a member of the specified forum and adds the authenticated user to the specified forum member list.

**Global GraphQL schema:**

![](https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/763853e479287cee87462549c34b16725e4b90a3bb6ac98e.png)