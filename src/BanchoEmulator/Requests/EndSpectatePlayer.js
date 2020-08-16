var TokenManager = require("../../TokenManager");
var UserFriend = require("../../Models/UserFriend");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    t.StopSpectating();
  }
};
