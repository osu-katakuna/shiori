const TokenManager = require("../../TokenManager");
const Parse = require('../Parsers/ChatMessageParser');
const PluginManager = require("../../PluginManager");
const UserPrivateMessage = require("../../Models/UserPrivateMessage");

module.exports = ({ req, res, token, data }) => {
  const m = Parse(data);
  var sender = TokenManager.GetToken(token);
  var target = TokenManager.FindTokenUsername(m.channel);

  if (target == null) {
    sender.Message(target.user, target.user.name, "The current user is offline.");
    return; // user is offline lol
  };

  if (token.MutedTime > 0) {
    return;
  };

  // create message
  let msg = new UserPrivateMessage();
  msg.from_user = sender.user.id;
  msg.to_user = target.user.id;
  msg.content = m.message;

  if((targetAction = msg.content.toUpperCase().indexOf("\x01ACTION")) >= 0) {
    msg.content = msg.content.slice(targetAction + 8);
    msg.is_action = true;
    msg.content[msg.content.length - 1] == '\x01' && (msg.content = msg.content.slice(0, -1));
  }

  msg.save();

  if (!PluginManager.CallHook("onPrivateMessage", target.user, sender.user, msg)) {
    target.Message(sender.user, sender.user.name, msg.content);
  }
};