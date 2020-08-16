var TokenManager = require("../../TokenManager");
var Parser = require("../Parsers/SpectatorFrameParser");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    t.SendSpectatorFrame(Parser(data));
  }
};
