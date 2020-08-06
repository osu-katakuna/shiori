const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (channel) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_channelInfo,
  data: [
    {
      type: PacketGenerator.Type.String,
      value: channel.name
    },
    {
      type: PacketGenerator.Type.String,
      value: channel.description
    },
    {
      type: PacketGenerator.Type.Int16,
      value: channel.memberCount
    }
  ]
});
