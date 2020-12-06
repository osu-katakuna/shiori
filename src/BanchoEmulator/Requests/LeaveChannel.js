const TokenManager = require("../../TokenManager");
const ChannelManager = require("../../ChannelManager");
const { ReadString } = require('../Packets/Utils');

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    ChannelManager.LeaveChannel(ReadString(data, 0), t.user);
  }
};
