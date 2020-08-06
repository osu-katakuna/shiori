const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (password) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_matchChangePassword,
  data: [
    {
      type: PacketGenerator.Type.String,
      value: password
    }
  ]
});
