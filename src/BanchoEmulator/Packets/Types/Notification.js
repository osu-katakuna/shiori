const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (message) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_notification,
  data: [
    {
      type: PacketGenerator.Type.String,
      value: message
    }
  ]
});
