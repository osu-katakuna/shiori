const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (version) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_protocolVersion,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: version
    }
  ]
});
