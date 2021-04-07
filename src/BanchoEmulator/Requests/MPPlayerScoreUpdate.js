var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
const Parse = require('../Parsers/MPScoreFrame');
var Logger = require('../../Logger');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const parsed = Parse(data);
    if(t.inMatch) {
      var match = MultiplayerManager.GetMatchID(t.matchID);
      match.playerScoreUpdate(t, parsed);
    }
  }
};
