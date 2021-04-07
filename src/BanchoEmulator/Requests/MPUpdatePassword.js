var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
const Parse = require('../Parsers/MPMatchInfo');
var Logger = require('../../Logger');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const parsed = Parse(data);
    if(t.inMatch) {
      var match = MultiplayerManager.GetMatchID(t.matchID);
      if(match.host.user.id != t.user.id) {
        Logger.Failure(`${token.user.data} tried to modify MP#${t.matchID} password but it's not the host!`);
        return;
      }
      const password = parsed.password == '' || parsed.password <= 0 ? null : parsed.password;
      console.log(password);

      match.password = password;
      match.update();
    }
  }
};
