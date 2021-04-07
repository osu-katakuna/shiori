var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
var Logger = require('../../Logger');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    if(t.inMatch) {
      var match = MultiplayerManager.GetMatchID(t.matchID);
      if(match.host.user.id != t.user.id) {
        Logger.Failure(`${token.user.data} tried to start the MP #${t.matchID} match but it's not the host!`);
        return;
      }

      match.start();
    }
  }
};
