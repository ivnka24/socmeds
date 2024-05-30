const { GraphQLScalarType, Kind, GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");

const typeDefs = `#graphql
   scalar Date

  type Follow {
    _id: ID
    name: String
    username: String!
    email: String!
  }

  input inputFollow {
    followerId: ID!
  }

  type UserByFollow {
    name: String
    username: String
    email: String
    Followers: [Follow]
    Followings: [Follow]
  }

  type Query {
    follows: [Follow]
    userById: UserByFollow
  }

  type MessageFollow {
    message: String
  }

  type Mutation {
    followUser(input: inputFollow): MessageFollow    
  }
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
  Query: {
    follows: async (_, __, contextValue) => {
      const { db } = contextValue;
      const follows = await db.collection("Follow").find();

      return follows.toArray();
    },
    userById: async (_, __, contextValue) => {
      try {
        const auth = await contextValue.authentication();
        const { db } = contextValue;

        const followers = await db.collection("User");

        const agg = [
          {
            $match: {
              _id: new ObjectId(auth._id),
            },
          },
          {
            $lookup: {
              from: "Follow",
              localField: "_id",
              foreignField: "followingId",
              as: "Followings",
            },
          },
          {
            $project: {
              password: 0,
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "Followings.followerId",
              foreignField: "_id",
              as: "Followings",
            },
          },
          {
            $project: {
              "Followings.password": 0,
            },
          },
          {
            $lookup: {
              from: "Follow",
              localField: "_id",
              foreignField: "followerId",
              as: "Followers",
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "Followers.followingId",
              foreignField: "_id",
              as: "Followers",
            },
          },
          {
            $project: {
              "Followers.password": 0,
            },
          },
        ];
        const cursor = followers.aggregate(agg);
        const followerById = await cursor.toArray();
        return followerById[0];
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  Mutation: {
    followUser: async (_, args, contextValue) => {
      try {
        const auth = await contextValue.authentication();
        const followingId = new ObjectId(auth._id);
        const follow = {
          followingId: followingId,
          followerId: new ObjectId(args.input.followerId),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const { db } = contextValue;
        const findUser = await db
          .collection("User")
          .findOne({ _id: new ObjectId(args.input.followerId) });
        if (!findUser) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "UserNotFound",
              exstension: {
                code: 404,
              },
            },
          });
        }
        const followUser = await db.collection("Follow").insertOne(follow);
        return {
          message: "Follow success",
        };
      } catch (error) {
        console.log(error, "<<<");
        return error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
