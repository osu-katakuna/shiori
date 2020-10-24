const Model = require("../Model");
const CountryList = require('../BanchoEmulator/Constants/Country');
const TokenManager = require("../TokenManager");
const UserFriend = require("./UserFriend");

class User extends Model {
  constructor() {
    super();

    this.userCountry = 0; // UNKNOWN
    this.abortLogin = false;
    this.token = null;
    this.countryCode = "";

    this.cachedStats = [];

    for(var i = 0; i < 8; i++) {
      this.cachedStats[i] = {
        pp: 1337,
        rank: 13,
        countryRank: 13,
        totalScore: 13,
        totalRankedScore: 1,
        playCount: 1,
        accuracy: 1,
        gameMode: i > 3 ? i - 4 : i
      };
    }
  }

  get friends() {
    return this.hasMany(UserFriend, "id", "user");
  }

  set status(v) {
    TokenManager.SetStatus(this, v);
  }

  get status() {
    return this.Token.status;
  }

  get stats() {
    return this.Token.stats;
  }

  get relaxMode() {
    return this.Token.relaxMode;
  }

  CacheStats(gamemode = 0) {
    this.cachedStats[gamemode] = {
      pp: 1337,
      rank: 13,
      countryRank: 13,
      totalScore: 13,
      totalRankedScore: 1,
      playCount: 1,
      accuracy: 1,
      gameMode: gamemode > 3 ? gamemode - 4 : gamemode
    };
  }

  get timezone() {
    return 0;
  }

  get role() {
    return 1;
  }

  get country() {
    return this.userCountry;
  }

  set country(c) {
    this.countryCode = c;
    if(c == "A2") this.countryCode = "Sattelite Provider";
    this.userCountry = CountryList[c] ? CountryList[c] : 0;
  }

  get Token() {
    return this.token ? TokenManager.GetToken(this.token) : TokenManager.FindTokenUserID(this.id);
  }

  hasPermission(permission) {
    return false;
  }

  Kick(reason = "no reason provided", closeClient = false) {
    this.abortLogin = true;
    TokenManager.KickUser(this.id, reason, closeClient);
  }

  Ban(reason = "no reason provided") {
    this.abortLogin = true;
    TokenManager.BanUser(this.id, reason);
  }

  Mute(reason = "no reason provided", time) {
    TokenManager.MuteUser(this.id, reason, time);
  }

  Unmute() {
    TokenManager.UnmuteUser(this.id);
  }

  Restrict() {
    TokenManager.RestrictUser(this.id);
  }

  CloseClient() {
    TokenManager.CloseClient(this.id);
  }

  NewStatus() {
    TokenManager.NewStatusUpdate(this);
  }
}

User.table = "users";
User.protected = [
  "password_hash"
];

module.exports = User;
