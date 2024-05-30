const bcrypt = require("bcryptjs");

const hashedPass = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const verifPass = (pass,hashPass) => {
    return bcrypt.compareSync(pass, hashPass);
}

module.exports = {hashedPass, verifPass}