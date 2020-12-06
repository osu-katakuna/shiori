const Model = require("../Model");
const TokenManager = require("../TokenManager");

class UserFriend extends Model {
  constructor() {
    super();

    this.cachedFriend = null;
  }

  get User() {
    if(this.cachedFriend) return this.cachedFriend;

    const User = require("./User");
    
    const t = TokenManager.FindTokenUserID(this.user_id);
    return (this.cachedFriend = t ? t.user : this.belongsTo(User, "user"));
  }
}

UserFriend.table = "user_friendships";

module.exports = UserFriend;
