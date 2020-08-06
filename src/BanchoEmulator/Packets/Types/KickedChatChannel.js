const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (channel) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_channelKicked,
  data: [
    {
      type: PacketGenerator.Type.String,
      value: channel
    }
  ]
});
