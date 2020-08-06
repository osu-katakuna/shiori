const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (message) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_jumpscare,
  data: [
    {
      type: PacketGenerator.Type.String,
      value: message
    }
  ]
});
