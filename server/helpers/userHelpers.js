const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };


const validatePasswordLength = (pass) => {
  try {
    if (pass < 5) {
      console.log("password minim 5");
      throw new GraphQLError("password must be at least 5 in length", {
        extensions: {
          code: "passLength",
          extensions: {
            code: 400,
          },
        },
      });
    }
  } catch (error) {
    return error
  }
}

  module.exports = {validateEmail, validatePasswordLength}