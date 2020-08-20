var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
var Logger = require('../../logging');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    let slot = data.readUInt32LE();
    if(t.inMatch) {
      var match = MultiplayerManager.GetMatchID(t.matchID);

      if(match.host.user.id != t.user.id) {
        Logger.Failure(`${token.user.data} tried to modify MP#${t.matchID} slot #${slot} lock state but it's not the host!`);
        return;
      }

      match.toggleSlotLock(slot);
    }
  }
};
