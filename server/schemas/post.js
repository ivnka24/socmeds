const { GraphQLScalarType, Kind, GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");

const typeDefs = `#graphql
  scalar Date

type Posts {
  _id: ID
  content: String!
  tags: [String] 
  imgUrl: String
  authorId: ID!
  comments: [Comments]
  likes: [Likes]
  createdAt: String
  updatedAt: String
}

type Comments {
  content: String!
  username: String!
  createdAt: String
  updatedAt: String
}

type Likes {
  username: String!
  createdAt: String
  updatedAt: String
}

input inputPost {
  content: String!
  tags: [String] 
  imgUrl: String
}

type Username {
  _id: ID
  name: String
  username: String!
  email: String!
}

type GetPost {
  _id: ID
  content: String!
  tags: [String] 
  imgUrl: String
  authorId: ID!
  comments: [Comments]
  likes: [Likes]
  Author: Username
  createdAt: String
  updatedAt: String
}

type ResponePost {
  content: String!
  tags: [String] 
  imgUrl: String
  authorId: ID!
  comments: [Comments]
  likes: [Likes]
  createdAt: String
  updatedAt: String
}

input inputComment {
  content: String!
}

type ResponeLike {
  message: String
}

type Query {
post: [Posts]
getPost: [GetPost]
getPostById(_id:ID!) : GetPost
}

type Mutation {
  createPost(input: inputPost): ResponePost
  createLike(_id:ID!): ResponeLike
  createComment(_id:ID!, input: inputComment): ResponeLike
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
    post: async (_, __, contextValue) => {
      try {
        const { db } = contextValue;
        const posts = await db.collection("Post").find().toArray();
        return posts;
      } catch (error) {
        return error;
      }
    },
    getPost: async (_, __, contextValue) => {
      try {
        const { redis } = contextValue;
        const postCache = await redis.get("post:all");
        if (postCache) {
          return JSON.parse(postCache);
        }
        const { db } = contextValue;
        let getPost = await db.collection("Post");
        const agg = [
          {
            $lookup: {
              from: "User",
              localField: "authorId",
              foreignField: "_id",
              as: "Author",
            },
          },
          {
            $project: {
              "Author.password": 0,
            },
          },
          {
            $unwind: {
              path: "$Author",
            },
          },
        ];
        const cursor = getPost.aggregate(agg);
        const posts = await cursor.toArray();
        console.log(posts.Author, "<<< masuk ");
        await redis.set("post:all", JSON.stringify(posts));
        return posts;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getPostById: async (_, args, contextValue) => {
      try {
        const auth = await contextValue.authentication();

        const { db } = contextValue;
        const findPostById = await db.collection("Post");
        const agg = [
          {
            $match: {
              _id: new ObjectId(args._id),
            },
          },
          {
            $lookup: {
              from: "User",
              localField: "authorId",
              foreignField: "_id",
              as: "Author",
            },
          },
          {
            $project: {
              "Author.password": 0,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $unwind: {
              path: "$Author",
            },
          },
        ];
        const cursor = findPostById.aggregate(agg);
        const post = await cursor.toArray();

        return post[0];
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  Mutation: {
    createPost: async (_, args, contextValue) => {
      try {
        const auth = await contextValue.authentication();
        const { redis } = contextValue;
        if (args.input.content === "" || !args.input.content) {
          throw new GraphQLError("Content is required", {
            extensions: {
              code: "ContentRequired",
              extensions: {
                code: 400,
              },
            },
          });
        }
        const post = {
          content: args.input.content,
          tags: args.input.tags || [],
          imgUrl: args.input.imgUrl,
          authorId: new ObjectId(auth._id),
          comments: [],
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const { db } = contextValue;
        const createPost = await db.collection("Post").insertOne(post);

        await redis.del("post:all");
        return {
          ...post,
          _id: createPost.insertedId,
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    createLike: async (_, args, contextValue) => {
      const auth = await contextValue.authentication();
      const { redis } = contextValue;

      const like = {
        username: auth.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const { db } = contextValue;
      // console.log(args._id, '<<<< id');
      const findPost = await db
        .collection("Post")
        .findOne({ _id: new ObjectId(args._id) });
      if (!findPost) {
        throw new GraphQLError("Post not found", {
          extensions: {
            code: "PostNotFound",
            extensions: {
              code: 404,
            },
          },
        });
      }
      const createLike = await db
        .collection("Post")
        .updateOne({ _id: findPost._id }, { $push: { likes: like } });
      await redis.del("post:all");

      return {
        message: "Like successfully",
      };
    },
    createComment: async (_, args, contextValue) => {
      try {
        const auth = await contextValue.authentication();
        const { redis } = contextValue;

        const comment = {
          content: args.input.content,
          username: auth.username,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const { db } = contextValue;
        const findPost = await db
          .collection("Post")
          .findOne({ _id: new ObjectId(args._id) });
        if (!findPost) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "PostNotFound",
              extensions: {
                code: 404,
              },
            },
          });
        }
        console.log(findPost, "<<<<<<");
        const createComment = await db
          .collection("Post")
          .updateOne({ _id: findPost._id }, { $push: { comments: comment } });
        await redis.del("post:all");

        return {
          message: "Comment successfully",
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
