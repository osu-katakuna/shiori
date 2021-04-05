const Model = require("../Model");
const Beatmap = require("./Beatmap");

class BeatmapSet extends Model {
  constructor() {
    super();
  }

  get beatmaps() {
    return this.hasMany(Beatmap, "id", "setID");
  }
}

BeatmapSet.table = "beatmap_sets";

module.exports = BeatmapSet;
