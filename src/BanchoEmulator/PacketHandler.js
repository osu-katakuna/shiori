const Logger = require('../logging');

const PacketHandlerTable = {
  1: require("./Requests/SendMessage"),   // send channel message
  4: () => {},                            // noop; ping
  63: require("./Requests/JoinChannel"),  // join chat channel
  78: require("./Requests/LeaveChannel")  // part chat channel
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
