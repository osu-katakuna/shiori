const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (user) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_userStats,
  data: [
    {
      type: PacketGenerator.Type.Int32,
      value: user.id
    },
    {
      type: PacketGenerator.Type.Byte,
      value: user.status.type
    },
    {
      type: PacketGenerator.Type.String,
      value: user.status.text
    },
    {
      type: PacketGenerator.Type.String,
      value: user.status.hash
    },
    {
      type: PacketGenerator.Type.UInt32,
      value: user.status.mods
    },
    {
      type: PacketGenerator.Type.Byte,
      value: user.gameMode
    },
    {
      type: PacketGenerator.Type.Int32,
      value: 0
    },
    {
      type: PacketGenerator.Type.Int64,
      value: user.totalRankedScore
    },
    {
      type: PacketGenerator.Type.Float,
      value: user.accuracy
    },
    {
      type: PacketGenerator.Type.Int32,
      value: user.playCount
    },
    {
      type: PacketGenerator.Type.Int64,
      value: user.pp < 32767 ? user.totalScore : user.pp
    },
    {
      type: PacketGenerator.Type.Int32,
      value: user.rank
    },
    {
      type: PacketGenerator.Type.Int16,
      value: user.pp < 32767 ? user.pp : 0
    }
  ]
});
