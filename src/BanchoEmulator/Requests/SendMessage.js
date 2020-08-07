var TokenManager = require("../../TokenManager");
var ChannelManager = require("../../ChannelManager");
const Parse = require('../Parsers/ChatMessageParser');

module.exports = ({req, res, token, data}) => {
  const m = Parse(data);
  ChannelManager.SendMessage(m.channel, TokenManager.GetToken(token).user, m.message);
};
