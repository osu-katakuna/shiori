const Model = require("../Model");

class Beatmap extends Model {
  constructor() {
    super();
    this.basePlays = 0;
    this.basePasses = 0;
  }

  get set() {
    const BeatmapSet = require("./BeatmapSet");
    return this.belongsTo(BeatmapSet, "setID");
  }

  get userPlays() {
    const UserPlay = require("./UserPlay");
    return this.hasMany(UserPlay, "id", "beatmapID");
  }

  set plays(v) {
    this.basePlays = v == null ? 0 : v;
  }

  set passes(v) {
    this.basePasses = v == null ? 0 : v;
  }

  get plays() {
    return this.basePlays + this.userPlays.length;
  }

  get passes() {
    return this.basePasses + 1;
  }

  get FullName() {
    const s = this.set;
    return `${s.artist} - ${s.title} [${this.name}] (${s.creator})`;
  }

  get leaderboard() {
    // plays sorting:
    let usePP = false; // use config entry for this

    // 1. select only passed plays
    let plays = this.userPlays.filter(p => p.pass);

    // 2. sort by score/pp
    plays = plays.sort((a, b) => usePP ? (b.pp - a.pp) : (b.score - a.score));

    // 3. remove old/duplicate scores
    plays = plays.filter((userPlay, pos) => plays.findIndex(play => play.userID == userPlay.userID) == pos);

    return plays;
  }
}

Beatmap.table = "beatmaps";

module.exports = Beatmap;
