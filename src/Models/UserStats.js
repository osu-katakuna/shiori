const Model = require("../Model");

class UserStats extends Model {
    constructor() {
        super();
        if(this.pp == null) this.pp = 0;
        this.pp = parseInt(this.pp);
        if(this.ranking == null) this.ranking = 1;
        this.ranking = parseInt(this.ranking);
        if(this.score == null) this.score = 0;
        this.score = parseInt(this.score);
        if(this.rankedScore == null) this.rankedScore = 0;
        this.rankedScore = parseInt(this.rankedScore);
        if(this.playCount == null) this.playCount = 0;
        this.playCount = parseInt(this.raplayCountnking);
        if(this.accuracy == null) this.accuracy = 0.0;
        this.accuracy = parseFloat(this.accuracy);
    }
}

UserStats.table = "user_stats";

module.exports = UserStats;