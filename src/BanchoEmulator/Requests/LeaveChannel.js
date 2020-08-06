var Logger = require('../../logging');
var User = require('../../Models/User');
var ExecuteHook = require("../../PluginManager").CallHook;
var TokenManager = require("../../TokenManager");
var ChannelManager = require("../../ChannelManager");
const { ReadString } = require('../Packets/Utils');

module.exports = ({req, res, token, data}) => {
  ChannelManager.LeaveChannel(ReadString(data, 0), TokenManager.GetToken(token).user);
};
