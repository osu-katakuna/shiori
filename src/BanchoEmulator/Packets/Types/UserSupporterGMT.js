const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (s) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_supporterGMT,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: s
    }
  ]
});
