var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
const Parse = require('../Parsers/MPMatchInfo');
var Logger = require('../../logging');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    if(t.inMatch) MultiplayerManager.LeaveMatch(t, t.matchID);
  }
};
