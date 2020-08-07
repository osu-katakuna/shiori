var CallHook = require("../../PluginManager").CallHook;
var TokenManager = require('../../TokenManager');

module.exports = ({req, res, token, data}) => {
  CallHook("onUserDisconnection", TokenManager.GetToken(token).user);
  TokenManager.DestroyToken(token);
};
