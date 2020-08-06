const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (user_id) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_spectatorJoined,
  data: [
    {
      type: PacketGenerator.Type.UInt32,
      value: user_id
    }
  ]
});
