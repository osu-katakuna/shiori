const Packets = require('../Packets');
const Logger = require('../../logging');
const uuid = require('uuid').v4;
var User = require('../../Models/User');
const LoginParser = require('../Parsers/LoginParser');
var crypto = require('crypto');
var ExecuteHook = require("../../PluginManager").CallHook;
var TokenManager = require("../../TokenManager");
var ChannelManager = require("../../ChannelManager");

module.exports = ({req, res, token}) => {
  var LoginParameter = LoginParser(req.body);

  var user = User.where([
    ["name", LoginParameter.User],
    ["password_hash", crypto.createHash('sha256').update(LoginParameter.Password).digest('hex')]
  ])[0];

  if(user == null) {
    Logger.Failure("Login: Wrong user credentials.");
    res.write(Packets.LoginResponse(-1)); // Wrong Login Data

    // please check if the user exists... if so run the event.
    if((t = User.where([
      ["name", LoginParameter.User]
    ])[0]) != null) {
      ExecuteHook("onUserAuthenticationFail", t);
    }
  } else {
    if(TokenManager.FindTokenUserID(user.id) != null) {
      Logger.Success("Login: Authentication is successful, but this user is already online.");
      res.write(Packets.ServerRestart(1500));
      return;
    }

    Logger.Success("Login: Authentication is successful.");
    if(!user.verified) {
      Logger.Info(`${user.name} is a new user around here! Hi.`);
      user.verified = true;
      user.save();
    }

    user.token = TokenManager.CreateToken(user, token); // create token

    if(!ExecuteHook("onUserAuthentication", user) && user.abortLogin) {
      Logger.Info("Login aborted; probably by a plugin.");
      return;
    }

    user.Token.sendLoginResponse();

    !user.restricted && TokenManager.DistributeNewPanel(user);

    user.restricted && TokenManager.RestrictUser(user.id);

    TokenManager.AllOnlineUsers().forEach(u => {
      if(u.id == user.id || u.restricted) {
        return; // we don't need our panel or restricted players panels. we need online & clean players ok?
      }
      user.Token.NotifyUserPanel(u);
    });

    !user.restricted && user.Token.NotifyFriends(user.friends.map(m => m.friend));

    ChannelManager.JoinChannel("#osu", user);

    (user.restricted && user.Token.SupporterTag != null) && user.Token.SupporterTag();

    ExecuteHook("onUserAuthenticated", user);
  }
};
