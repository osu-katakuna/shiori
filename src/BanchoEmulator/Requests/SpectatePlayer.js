var TokenManager = require("../../TokenManager");
var UserFriend = require("../../Models/UserFriend");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const spectatedID = data.readInt32LE();

    // actually make sure the player is on
    if((p = TokenManager.FindTokenUserID(spectatedID)) != null) {
      t.Spectate(p.user);
    }
  }
};
