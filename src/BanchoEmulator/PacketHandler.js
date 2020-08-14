const Logger = require('../logging');

const PacketHandlerTable = {
  0: require("./Requests/StatusUpdate"),        // update user status
  1: require("./Requests/SendMessage"),         // send channel message
  2: require("./Requests/DestroySession"),      // destroy session token
  3: require("./Requests/RequestStatusUpdate"), // request status update from server
  4: () => {},                                  // noop; ping
  63: require("./Requests/JoinChannel"),        // join chat channel
  73: require("./Requests/AddFriend"),          // add friend
  78: require("./Requests/LeaveChannel"),       // part chat channel
  79: () => {},                                 // noop; ReceiveUpdates
  85: require("./Requests/RequestUserStats")    // request users stats
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
};
