const Model = require("../Model");
const CountryList = require('../BanchoEmulator/Constants/Country');
const TokenManager = require("../TokenManager");

class User extends Model {
  constructor() {
    super();

    this.userCountry = 0; // UNKNOWN
    this.abortLogin = false;
    this.token = null;
  }

  set status(v) {
    TokenManager.SetStatus(this.id, v);
  }

  get status() {
    return this.Token.status;
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
    this.userCountry = CountryList[c] ? CountryList[c] : 0;
  }

  get rank() {
    return 0;
  }

  get pp() {
    return 0;
  }

  get totalScore() {
    return 0;
  }

  get totalRankedScore() {
    return 0;
  }

  get playCount() {
    return 0;
  }

  get accuracy() {
    return 0;
  }

  get gameMode() {
    return 0;
  }

  get Token() {
    return this.token ? TokenManager.GetToken(this.token) : TokenManager.FindTokenUserID(this.id);
  }

  hasPermission(permission) {
    return false;
  }

  Kick(reason = "no reason provided", closeClient = false) {
    abortLogin = true;
    TokenManager.KickUser(this.id, reason, closeClient);
  }

  Ban(reason = "no reason provided") {
    abortLogin = true;
    TokenManager.BanUser(this.id, reason);
  }

  Mute(reason = "no reason provided", time) {
    TokenManager.MuteUser(this.id, reason, time);
  }

  Restrict(reason = "no reason provided", direct = true) {
    TokenManager.RestrictUser(this.id);
  }
}

User.table = "users";

module.exports = User;
