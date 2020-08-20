var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    if(t.inMatch) {
      var match = MultiplayerManager.GetMatchID(t.matchID);
      match.setMods(t, data.readUInt32LE());
    }
  }
};
