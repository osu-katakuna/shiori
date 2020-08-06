const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (friends_id) => {
  var packet = {
    type: PacketConstant.server_friendsList,
    data: [
      {
        type: PacketGenerator.Type.Int16,
        value: friends_id.length
      }
    ]
  };

  friends_id.forEach(id => packet.data.push({
    type: PacketGenerator.Type.UInt32,
    value: id
  }));

  return PacketGenerator.BuildPacket(packet)
};
