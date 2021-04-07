var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
var Logger = require('../../Logger');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const slot = data.readUInt32LE();
    if(t.inMatch) {
      var match = MultiplayerManager.GetMatchID(t.matchID);

      if(match.host.user.id != t.user.id) {
        Logger.Failure(`${token.user.data} tried to transfer MP#${t.matchID} host privilege to slot #${slot} but it's not the host!`);
        return;
      }

      match.setHost(match.getSlot(slot).player);
    }
  }
};
