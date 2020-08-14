var TokenManager = require("../../TokenManager");
var UserFriend = require("../../Models/UserFriend");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    let friendID = data.readInt32LE();

    let f = new UserFriend();
    f.user = t.user.id;
    f.friend = friendID;

    f.save();
  }
};
