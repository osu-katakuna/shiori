var TokenManager = require("../../TokenManager");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    t.spectatedUser.Token.NotifySpectatorNoMap(t.user);
  }
};
