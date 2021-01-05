var TokenManager = require("../../TokenManager");
const Parse = require('../Parsers/ChatMessageParser');

module.exports = ({req, res, token, data}) => {
  const m = Parse(data);
  var sender = TokenManager.GetToken(token)
  var target = TokenManager.FindTokenUsername(m.channel)

  if (target == null) {
      return
  }

  // TODO: For alex add bot support here
  if (token.MutedTime > 0) {
      // if they are muted dont allow them to talk
      return
  }
  target.Message(sender.user, target.user.name, m.message)
  
  //TODO: ADD SAVING MESSAGES TO DB
};
