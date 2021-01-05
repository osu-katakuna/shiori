const Model = require("../Model");

class UserPrivateMessage extends Model {
  get from() {
    const User = require("./User");
    return this.belongsTo(User, "from_user");
  }

  get to() {
    const User = require("./User");
    return this.belongsTo(User, "to_user");
  }

  get formattedContent() {
    return (this.is_action ? "\x01ACTION " : '') + this.content + (this.is_action ? "\x01" : '');
  }
}

UserPrivateMessage.table = "user_pm";

module.exports = UserPrivateMessage;
