const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (match) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_disposeMatch,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: match.id
    }
  ]
});
