const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = () => PacketGenerator.BuildPacket({
  type: PacketConstant.server_matchTransferHost,
  data: []
});
