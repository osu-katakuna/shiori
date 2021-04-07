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
        Logger.Failure(`${token.user.data} tried to modify MP#${t.matchID} parameters but it's not the host!`);
        return;
      }

      const beatmap = {
        name: parsed.beatmapName,
        hash: parsed.beatmapHash,
        id: parsed.beatmapHash
      };

      const password = parsed.password == '' || parsed.password <= 0 ? null : parsed.password;

      match.name = parsed.name;
      match.beatmap = beatmap;

      match.freeMod = parsed.freeMods;
      match.mods = parsed.mods;
      match.teamMode = parsed.matchTeamType;
      match.winCondition = parsed.matchScoringType;

      match.gameMode = parsed.gameMode;
      match.seed = parsed.seed;

      match.update();

    }
  }
};
