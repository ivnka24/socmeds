const { hashedPass, verifPass } = require("../helpers/bcrypt");
const { GraphQLError } = require("graphql");
const { validateEmail } = require("../helpers/userHelpers");
const { createToken } = require("../helpers/jwt");

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String!
    email: String!
  }

  input inputLogin {
    username: String!
    password: String!
  }

  input inputRegister {
    name: String
    username: String!
    email: String!
    password: String!
  }
  
  type LoginResponse {
    access_token: String
  }

  type Query {
    users: [User],
    searchUsername(username: String) : User
  }

  type Mutation {
    userLogin(input: inputLogin): LoginResponse
    addUser(input: inputRegister): User
  }
`;

const resolvers = {
  Query: {
    users: async (_, __, contextValue) => {
      const { db } = contextValue;
      const users = await db.collection("User").find();

      return users.toArray();
    },
    searchUsername: async (_, args, contextValue) => {
      try {
        const auth = await contextValue.authentication();
        console.log(auth, "< <<<<<<");
        const { db } = contextValue;
        const user = await db
          .collection("User")
          .findOne({ username: { $regex: new RegExp(args.username, "i") } });
        if (!user) {
          throw new GraphQLError("User not found");
        }
        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        };
      } catch (error) {
        console.log(error, "<<<<<<");
        return error;
      }
    },
  },
  Mutation: {
    addUser: async (_, args, contextValue) => {
      try {
        if (!args.input.username) {
          throw new GraphQLError("username is required", {
            extensions: {
              code: "usernameRequired",
              extensions: {
                code: 400,
              },
            },
          });
        }
        if (!args.input.email) {
          throw new GraphQLError("email is required", {
            extensions: {
              code: "emailRequired",
              extensions: {
                code: 400,
              },
            },
          });
        }
        if (!args.input.password) {
          throw new GraphQLError("password is required", {
            extensions: {
              code: "passwordRequired",
              extensions: {
                code: 400,
              },
            },
          });
        }
        const register = {
          name: args.input.name,
          username: args.input.username,
          email: args.input.email,
          password: hashedPass(args.input.password),
        };

        if (!validateEmail(args.input.email)) {
          throw new GraphQLError("invalid email format", {
            extensions: {
              code: "emailFormat",
              extensions: {
                code: 400,
              },
            },
          });
        }

        if (args.input.password.length < 5) {
          throw new GraphQLError("password must be at least 5 in length", {
            extensions: {
              code: "passLength",
              extensions: {
                code: 400,
              },
            },
          });
        }

        const { db } = contextValue;
        const query = { username: args.input.username };
        const findUsername = await db.collection("User").findOne(query);
        if (findUsername) {
          throw new GraphQLError("Username must be unique", {
            extensions: {
              code: "UsernameUnique",
              extensions: {
                code: 400,
              },
            },
          });
        }

        const queryEmail = { email: args.input.email };
        const findEmail = await db.collection("User").findOne(queryEmail);
        if (findEmail) {
          throw new GraphQLError("Email must be unique", {
            extensions: {
              code: "EmailUnique",
              extensions: {
                code: 400,
              },
            },
          });
        }
        const user = await db.collection("User").insertOne(register);

        return {
          _id: user.insertedId,
          name: register.name,
          username: register.username,
          email: register.email,
        };
      } catch (error) {
        return error;
      }
    },
    userLogin: async (_, args, contextValue) => {
      try {
        const queryUsername = { username: args.input.username };
        const { db } = contextValue;
        const findUsername = await db.collection("User").findOne(queryUsername);
        if (!findUsername) {
          throw new GraphQLError("Email/Password is invalid", {
            extensions: {
              code: "Email/PassInvalid",
              extensions: {
                code: 401,
              },
            },
          });
        }

        const passVerif = verifPass(args.input.password, findUsername.password);
        if (!passVerif) {
          throw new GraphQLError("Email/Password is invalid", {
            extensions: {
              code: "Email/PassInvalid",
              extensions: {
                code: 401,
              },
            },
          });
        }

        // console.log(findUsername, '<<<<');

        const payload = {
          username: findUsername.username,
          _id: findUsername._id,
        };

        const access_token = createToken(payload);

        console.log(access_token, "<<<<<");

        return {
          access_token,
        };
      } catch (error) {
        return error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
