var TokenManager = require("../../TokenManager");
var UserFriend = require("../../Models/UserFriend");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const friendID = data.readInt32LE();

    const f = UserFriend.where([
      ["user", t.user.id]
    ]);

    f.forEach(r => r.delete());
  }
};
