const TokenManager = require("../../TokenManager");
const MultiplayerManager = require("../../MultiplayerManager");

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    MultiplayerManager.JoinLobby(t);
  }
};
