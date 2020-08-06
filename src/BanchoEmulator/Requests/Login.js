const Packets = require('../Packets');
const Logger = require('../../logging');
const uuid = require('uuid').v4;
var User = require('../../Models/User');
const LoginParser = require('../Parsers/LoginParser');
var crypto = require('crypto');

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

    res.write(Packets.Notification("Welcome to katakuna!shiori v0.3 server!"));

    res.write(Packets.SilenceEndTime(0));
    res.write(Packets.LoginResponse(1000));
    res.write(Packets.ProtocolVersion(19));

    res.write(Packets.UserSupporterGMT(5)); // give supporter automatically.
    res.write(Packets.UserPanel(user));
    res.write(Packets.UserStats(user));
    res.write(Packets.ChannelInfoEnd());


  }
};
