const Model = require("../Model");
const CountryList = require('../BanchoEmulator/Constants/Country');

class User extends Model {
  constructor() {
    super();

    this.userCountry = 0; // UNKNOWN
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

  get mods() {
    return 0;
  }

  get statusMD5() {
    return "";
  }

  get statusText() {
    return "";
  }

  get action() {
    return 0;
  }
}

User.table = "users";

module.exports = User;
