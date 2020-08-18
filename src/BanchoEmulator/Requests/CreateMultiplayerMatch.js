var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
const Parse = require('../Parsers/MPMatchInfo');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const parsed = Parse(data);

    const maxPlayers = parsed.slots.filter(slot => slot.status == 1).length;
    const beatmap = {
      name: parsed.beatmapName,
      hash: parsed.beatmapHash,
      id: parsed.beatmapHash
    };
    const password = parsed.password == '' || parsed.password <= 0 ? null : parsed.password;

    MultiplayerManager.NewMatch(parsed.name, t, password, maxPlayers, false, parsed.gameMode);
  }
};
