if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { connect, getDB } = require("./config/mongo");
const client = require("./config/redis");
const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require("./schemas/users");
const {
  typeDefs: followTypeDefs,
  resolvers: followResolvers,
} = require("./schemas/follow");
const {
  typeDefs: postTypeDefs,
  resolvers: postResolvers,
} = require("./schemas/post");

const authMiddleware = require("./auth/authentication");
const server = new ApolloServer({
  typeDefs: [userTypeDefs, followTypeDefs, postTypeDefs],
  resolvers: [userResolvers, followResolvers, postResolvers],
  introspection: true,
});

(async () => {
  try {
    await connect();
    const redis = await client.connect();
    const db = await getDB();

    const { url } = await startStandaloneServer(server, {
      listen: {
        port: process.env.PORT || 6969,
      },
      context: async ({ req, res }) => {
        return {
          db,
          authentication: async () => await authMiddleware(req),
          redis,
        };
      },
    });
    console.log(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
})();
