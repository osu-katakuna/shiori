const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (user) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_userID,
  data: [
    {
      type: PacketGenerator.Type.UInt32,
      value: user.user_id
    }
  ]
});
