const Logger = require('../../Logger');
const User = require('../../Models/User');
const ExecuteHook = require("../../PluginManager").CallHook;
const TokenManager = require("../../TokenManager");
const ChannelManager = require("../../ChannelManager");
const { ReadString } = require('../Packets/Utils');

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    ChannelManager.JoinChannel(ReadString(data, 0), t.user);
  }
};
