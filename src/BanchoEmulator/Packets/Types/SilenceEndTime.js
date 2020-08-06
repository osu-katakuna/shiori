const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (time) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_silenceEnd,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: time
    }
  ]
});
