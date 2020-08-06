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
      value: user.action
    },
    {
      type: PacketGenerator.Type.String,
      value: user.statusText
    },
    {
      type: PacketGenerator.Type.String,
      value: user.statusMD5
    },
    {
      type: PacketGenerator.Type.UInt32,
      value: user.mods
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
      value: user.totalScore
    },
    {
      type: PacketGenerator.Type.Int32,
      value: user.rank
    },
    {
      type: PacketGenerator.Type.Int16,
      value: user.pp
    }
  ]
});
