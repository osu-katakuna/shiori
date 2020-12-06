const Model = require("../Model");

class UserRestriction extends Model {
  get User() {
    const User = require("./User");

    return this.belongsTo(User, "user");
  }
}

UserRestriction.table = "user_restrictions";

module.exports = UserRestriction;
