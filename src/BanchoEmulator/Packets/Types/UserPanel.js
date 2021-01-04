const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (user) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_userPanel,
  data: [
    {
      type: PacketGenerator.Type.UInt32,
      value: user.id
    },
    {
      type: PacketGenerator.Type.String,
      value: user.name
    },
    {
      type: PacketGenerator.Type.Byte,
      value: user.timezone
    },
    {
      type: PacketGenerator.Type.Int16,
      value: user.userCountry
    },
    {
      type: PacketGenerator.Type.Byte,
      value: user.role
    },
    {
      type: PacketGenerator.Type.Float,
      value: 0.0
    },
    {
      type: PacketGenerator.Type.Float,
      value: 0.0
    },
    {
      type: PacketGenerator.Type.Int32,
      value: user.rank
    }
  ]
});
