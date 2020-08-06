const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (data) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_spectateFrames,
  data: [
    {
      type: PacketGenerator.Type.Raw,
      value: data
    }
  ]
});
