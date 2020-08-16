var CallHook = require("../../PluginManager").CallHook;
var TokenManager = require('../../TokenManager');

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    CallHook("onUserDisconnection", t.user);
    TokenManager.DestroyToken(token);
  }
};
