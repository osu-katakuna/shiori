const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (channel) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_channelJoinSuccess,
  data: [
    {
      type: PacketGenerator.Type.String,
      value: channel
    }
  ]
});
