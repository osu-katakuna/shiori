var TokenManager = require("../../TokenManager");
var UserFriend = require("../../Models/UserFriend");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    let friendID = data.readInt32LE();

    let f = UserFriend.where([
      ["user", t.user.id]
    ]);

    f.forEach(r => r.delete());
  }
};
