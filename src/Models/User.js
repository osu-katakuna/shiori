const Model = require("../Model");
const CountryList = require('../BanchoEmulator/Constants/Country');
const TokenManager = require("../TokenManager");
const UserFriend = require("./UserFriend");
const UserStats = require("./UserStats");
const UserRestriction = require("./UserRestriction");
const WebhookHandler = require("../Webhook/WebhookHandlers");
const UserPrivateMessage = require("./UserPrivateMessage");

class User extends Model {
  constructor() {
    super();

    this.userCountry = 0; // UNKNOWN
    this.abortLogin = false;
    this.token = null;
    this.countryCode = "";
    this.rawCountry = "__";

    this.cachedStats = [];
  }

  get friends() {
    return this.hasMany(UserFriend, "id", "user");
  }

  get restrictions() {
    return this.hasMany(UserRestriction, "id", "user");
  }

  get restricted() {
    return this.restrictions.filter(x => !x.pardoned).length > 0;
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

  get unreadMessages() {
    return UserPrivateMessage.where([["to_user", this.id], ["is_read", 0]]);
  }

  CacheStats(gamemode = 0) {
    this.GetStats(gamemode);
  }

  GetStats(gamemode = 0) {
    const stats = this.statsM(gamemode);

    this.cachedStats[gamemode] = {
      pp: stats.pp,
      rank: stats.ranking,
      totalScore: stats.score,
      totalRankedScore: stats.rankedScore,
      playCount: stats.playCount,
      accuracy: stats.accuracy / 100,
      gameMode: gamemode > 3 ? gamemode - 4 : gamemode
    };
  }

  statsM(gamemode = 0) {
    let eek = UserStats.where([
      ["userID", this.id],
      ["gameMode", gamemode]
    ])[0];

    if(eek == null) {
      eek = new UserStats();
      eek.userID = this.id;
      eek.gameMode = gamemode;
    }

    return eek;
  }

  get timezone() {
    return 0;
  }

  get Role() {
    return 1;
  }

  get country() {
    return this.rawCountry;
  }

  set country(c) {
    this.countryCode = c;
    if(c == "A2") this.countryCode = "Sattelite Provider";
    this.userCountry = CountryList[c] ? CountryList[c] : 0;
    this.rawCountry = CountryList[c] ? c : '__';
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

  Ban(reason = "no reason provided", time = -1) {
    this.abortLogin = true;
    TokenManager.BanUser(this.id, reason);
  }

  Mute(reason = "no reason provided", time) {
    TokenManager.MuteUser(this.id, reason, time);
  }

  Unmute() {
    TokenManager.UnmuteUser(this.id);
  }

  Restrict(reason = "no reason provided", time = -1, dontSave = false) {
    TokenManager.RestrictUser(this.id);

    if(!dontSave) {
      const r = new UserRestriction();

      r.user = this.id;
      r.reason = reason;
      r.permanent = time < 0;
      if(time > 0) r.end = new Date(new Date().getTime() + (time * 1000));

      r.save();

      WebhookHandler.onUserRestriction(r);
    }
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
