const Model = require("../Model");

class UserRestriction extends Model {
  constructor() {
    super();
  }

  get User() {
    const User = require("./User");

    return this.belongsTo(User, "user");
  }
}

UserRestriction.table = "user_restrictions";

module.exports = UserRestriction;
