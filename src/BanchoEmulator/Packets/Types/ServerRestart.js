const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (time) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_restart,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: time
    }
  ]
});
