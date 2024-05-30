const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const { decoded } = require("../helpers/jwt");
const { getDB, connect } = require("../config/mongo");
async function authentication(req) {
  try {
    await connect();
    const db = await getDB();

    const { authorization } = req.headers;
    if (!authorization) {
      throw new GraphQLError("invalid token", {
        extensions: {
          code: "InvalidToken",
          extensions: {
            code: 401,
          },
        },
      });
    }
    let token = authorization.split(" ")[1];
    
    const verify = decoded(token);
    const id = new ObjectId(verify._id);
    const findUser = await db.collection("User").findOne({ _id: id });
    if (!findUser) {
      throw new GraphQLError("invalid token", {
        extensions: {
          code: "InvalidToken",
          extensions: {
            code: 401,
          },
        },
      });
    }
    return {
      _id: findUser._id,
      username: findUser.username,
      email: findUser.email,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = authentication;
