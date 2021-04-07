const Logger = require('../Logger');
const TokenManager = require('../TokenManager');

const PacketHandlerTable = {
  0: require("./Requests/StatusUpdate"),            // update user status
  1: require("./Requests/SendMessage"),             // send channel message
  2: require("./Requests/DestroySession"),          // destroy session token
  3: require("./Requests/RequestStatusUpdate"),     // request status update from server
  4: () => {},                                      // noop; ping
  16: require("./Requests/SpectatePlayer"),         // start spectating
  17: require("./Requests/EndSpectatePlayer"),      // stop spectating
  18: require("./Requests/SpectatorFrame"),         // player sent an spectator frame
  21: require("./Requests/NoBeatmapSpectator"),     // player doesn't have the map
  25: require("./Requests/SendPrivateMessage"),        // send a private message
  29: require("./Requests/LeaveLobby"),             // leave multiplayer lobby
  30: require("./Requests/EnterLobby"),             // enter multiplayer lobby
  31: require("./Requests/CreateMultiplayerMatch"), // create multiplayer match
  32: require("./Requests/JoinMultiplayerMatch"),   // join multiplayer match
  33: require("./Requests/LeaveMultiplayerMatch"),  // leave current multiplayer match
  38: require("./Requests/MPPlayerMoveSlot"),       // move to an selected slot
  39: require("./Requests/MPPlayerReady"),          // multiplayer player is ready
  40: require("./Requests/MPToggleSlotLock"),       // toggle slot lock state
  41: require("./Requests/UpdateMatchInfo"),        // update multiplayer match info
  44: require("./Requests/StartMPMatch"),           // start multiplayer match
  47: require("./Requests/MPPlayerScoreUpdate"),    // update multiplayer player score
  49: require("./Requests/PlayerFinishedMapMP"),    // multiplayer player finished the map
  51: require("./Requests/PlayerSetModsMPMatch"),   // set player mods in an multiplayer match
  52: require("./Requests/PlayerLoadedMapMP"),      // player loaded map and the server can start the match
  54: require("./Requests/MPPlayerNoMap"),          // multiplayer player doesn't have the map
  55: require("./Requests/MPPlayerNotReady"),       // multiplayer player is NOT ready
  56: require("./Requests/MPPlayerFailed"),         // multiplayer player failed
  59: require("./Requests/MPPlayerGotMap"),         // multiplayer player finally got his map
  60: require("./Requests/PlayerSkipMP"),           // player requested to skip
  63: require("./Requests/JoinChannel"),            // join chat channel
  70: require("./Requests/MPPlayerTransferHost"),   // multiplayer host transfer
  73: require("./Requests/AddFriend"),              // add friend
  74: require("./Requests/RemoveFriend"),           // remove friend
  77: require("./Requests/MPToggleTeams"),          // toggle between MP Teams
  78: require("./Requests/LeaveChannel"),           // part chat channel
  79: () => {},                                     // noop; ReceiveUpdates
  85: require("./Requests/RequestUserStats"),       // request users stats
  90: require("./Requests/MPUpdatePassword")        // update multiplayer match password
};

function ParsePacket(packet) {
  var offset = 0;
  var packets = [];

  while(offset < packet.length) {
    packets.push({
      "type": packet.readUInt16LE(offset),
      "data": new Buffer.from(packet.slice(offset + 7, offset + packet.readUInt32LE(offset + 3) + 7))
    });

    offset += packet.readUInt32LE(offset + 3) + 7;
  }

  return packets;
}

module.exports = ({req, res, token}) => {
  ParsePacket(req.body).forEach(p => {
    if(PacketHandlerTable[p.type] == null) Logger.Failure(`PacketHandler: unhandled: packet type ${p.type}; data ${p.data.toString("hex")}`);
    else {
      Logger.Success(`PacketHandler: execute: packet type ${p.type}; data ${p.data.toString("hex")}`);
      PacketHandlerTable[p.type]({req, res, token, data: p.data});
    }
  });

  if((t = TokenManager.GetToken(token)) != null) t.queueSpectatorFrames();
};
