const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (slot) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_matchPlayerFailed,
  data: [
    {
      type: PacketGenerator.Type.UInt32,
      value: slot
    }
  ]
});
