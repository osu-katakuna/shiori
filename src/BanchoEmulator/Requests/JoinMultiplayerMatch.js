var TokenManager = require("../../TokenManager");
var MultiplayerManager = require("../../MultiplayerManager");
const Parse = require('../Parsers/MPJoinPacket');
var Logger = require('../../logging');

module.exports = ({token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const parsed = Parse(data);
    MultiplayerManager.JoinMatch(t, parsed.id, parsed.password)
  }
};
