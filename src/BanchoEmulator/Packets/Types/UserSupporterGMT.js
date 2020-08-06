const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (user) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_supporterGMT,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: 1 + (user.supporter ? 4 : 0) + (user.GMT ? 2 : 0)
    }
  ]
});
