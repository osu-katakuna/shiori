function Initialize() {
  const RedisSubsystem = require("../Redis");
  const TokenManager = require("../TokenManager");
  const Logger = require("../logging");

  RedisSubsystem.SubscribeToChannel("shiori:ban", function(userID) {
    Logger.Info(`REDIS: Received command to ban user id ${userID} on here.`);
    if((t = TokenManager.FindTokenUserID(userID)) != null)
      t.user.Ban();
  });

  RedisSubsystem.SubscribeToChannel("shiori:update.online_users", async() => {
    if(await RedisSubsystem.Get("shiori:online_users") != TokenManager.OnlineUsersCount())
      RedisSubsystem.Set("shiori:online_users", TokenManager.OnlineUsersCount());
  });

  RedisSubsystem.SubscribeToChannel("shiori:restrict", function(userID) {
    Logger.Info(`REDIS: Received command to restrict user id ${userID} on here.`);
    if((t = TokenManager.FindTokenUserID(userID)) != null)
      t.user.Restrict();
  });

  RedisSubsystem.SubscribeToChannel("shiori:unmute", function(userID) {
    Logger.Info(`REDIS: Received command to unmute user id ${userID}.`);
    if((t = TokenManager.FindTokenUserID(userID)) != null)
      t.user.Unmute();
  });

  RedisSubsystem.SubscribeToChannel("shiori:update.user_stats", function(userID) {
    Logger.Info(`REDIS: Received command to update cached stats for user id ${userID}.`);
    if((t = TokenManager.FindTokenUserID(userID)) != null) {
      t.user.CacheStats();
      t.user.NewStatus();
    }
  });


  RedisSubsystem.SubscribeToChannel("shiori:kick", function(d) {
    let obj = JSON.parse(d);

    if(obj.userID == null) return;

    let reason = obj.reason ? obj.reason : "no reason provided";

    Logger.Info(`REDIS: Received command to kick user id ${obj.userID} for the following reason: ${reason}.`);

    if((t = TokenManager.FindTokenUserID(obj.userID)) != null)
      t.user.Kick(reason, obj.closeClient ? obj.closeClient : false);
  });

  RedisSubsystem.SubscribeToChannel("shiori:mute", function(d) {
    let obj = JSON.parse(d);

    if(obj.userID == null && obj.time == null) return;

    let reason = obj.reason ? obj.reason : "no reason provided";

    Logger.Info(`REDIS: Received command to mute user id ${obj.userID} for ${obj.time}s for the following reason: ${reason}.`);

    if((t = TokenManager.FindTokenUserID(obj.userID)) != null)
      t.user.Mute(reason, obj.time);
  });
}

module.exports = {
  Initialize
};
