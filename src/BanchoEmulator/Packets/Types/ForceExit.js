const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = () => new Buffer.concat([
  PacketGenerator.BuildPacket({
    type: PacketConstant.server_supporterGMT,
    data: [
      {
        type: PacketGenerator.Type.Int32,
        value: 128
      }
    ]
  }),
  PacketGenerator.BuildPacket({
    type: PacketConstant.server_ping,
    data: []
  })
]);
