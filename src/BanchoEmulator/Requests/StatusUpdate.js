var User = require('../../Models/User');
var TokenManager = require('../../TokenManager');
const Parse = require('../Parsers/Status');
const Status = require('../../Models/Status').Status;
var CallHook = require("../../PluginManager").CallHook;

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) == null) {
    return;
  }
  
  const m = Parse(data);

  var newStatus = new Status();

  newStatus.type = m.type;
  newStatus.hash = m.hash;
  newStatus.text = m.text;
  newStatus.mods = m.mods;
  newStatus.gameMode = m.gameMode;

  t.user.status = newStatus;
  CallHook("onStatusUpdate", TokenManager.GetToken(token).user);
};
