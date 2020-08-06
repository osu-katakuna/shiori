const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (i) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_userID,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: i
    }
  ]
});
