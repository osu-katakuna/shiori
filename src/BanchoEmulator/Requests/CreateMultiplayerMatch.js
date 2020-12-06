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

    var password = parsed.password == '' || parsed.password <= 0 ? null : parsed.password;
    const privateMatch = password != null && password.indexOf("//private") > 0;

    if(password != null && password.indexOf("//private") > 0) password = password.slice(0, password.indexOf("//private"));

    MultiplayerManager.NewMatch(parsed.name, t, password, maxPlayers, !privateMatch, parsed.gameMode);
  }
};
