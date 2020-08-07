const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (from, to, message) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_sendMessage,
  data: [
    {
      type: PacketGenerator.Type.String,
      value: from.name
    },
    {
      type: PacketGenerator.Type.String,
      value: message
    },
    {
      type: PacketGenerator.Type.String,
      value: to
    },
    {
      type: PacketGenerator.Type.UInt32,
      value: from.id
    }
  ]
});
