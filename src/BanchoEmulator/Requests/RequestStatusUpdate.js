var TokenManager = require("../../TokenManager");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const oldRank = t.stats.rank;
    t.user.CacheStats();

    // if the rank did not change, just send it to the owning client. it's not required to distribute it.
    t.stats.rank == oldRank && t.NotifyUserStats(t.user);

    // SEND TO SPECTATORS! TO DO!!
    TokenManager.DistributeNewStats(t.user);
  }
};
