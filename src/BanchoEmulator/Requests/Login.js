const Packets = require('../Packets');
const Logger = require('../../logging');
const uuid = require('uuid').v4;
var User = require('../../Models/User');
const LoginParser = require('../Parsers/LoginParser');
var crypto = require('crypto');
var ExecuteHook = require("../../PluginManager").CallHook;
var TokenManager = require("../../TokenManager");

module.exports = ({req, res, token}) => {
  var LoginParameter = LoginParser(req.body);

  var user = User.where([
    ["name", LoginParameter.User],
    ["password_hash", crypto.createHash('sha256').update(LoginParameter.Password).digest('hex')]
  ])[0];

  if(user == null) {
    Logger.Failure("Login: Wrong user credentials.");
    res.write(Packets.LoginResponse(-1)); // Wrong Login Data
  } else {
    Logger.Success("Login: Authentication is successful.");

    TokenManager.CreateToken(user, token); // create token
    var token = TokenManager.GetToken(token);

    ExecuteHook("onUserAuthentication", user, token);

    if(user.abortLogin) {
      Logger.Info("Login aborted; probably by an plugin.");
      return;
    }

    token.sendLoginResponse();
    TokenManager.NotifyEveryoneAboutNewUser(user.id);

    ExecuteHook("onUserAuthenticated", user, token);
  }
};
