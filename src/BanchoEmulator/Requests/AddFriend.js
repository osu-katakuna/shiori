var TokenManager = require("../../TokenManager");
var UserFriend = require("../../Models/UserFriend");
var ExecuteHook = require("../../PluginManager").CallHook;

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const friendID = data.readInt32LE();

    const f = new UserFriend();
    f.user = t.user.id;
    f.friend = friendID;

    ExecuteHook("userAdd", f.user, t.user);

    f.save();
  }
};
