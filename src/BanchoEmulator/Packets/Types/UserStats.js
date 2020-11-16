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
      value: user.relaxMode != null && user.relaxMode ? (user.status.text ? user.status.text + " on Relax" : "on Relax") : user.status.text
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
      value: user.stats.gameMode
    },
    {
      type: PacketGenerator.Type.Int32,
      value: 0
    },
    {
      type: PacketGenerator.Type.Int64,
      value: user.stats.totalRankedScore
    },
    {
      type: PacketGenerator.Type.Float,
      value: user.stats.accuracy
    },
    {
      type: PacketGenerator.Type.Int32,
      value: user.stats.playCount
    },
    {
      type: PacketGenerator.Type.Int64,
      value: user.stats.pp < 32767 ? user.stats.totalScore : user.stats.pp
    },
    {
      type: PacketGenerator.Type.Int32,
      value: user.stats.rank
    },
    {
      type: PacketGenerator.Type.Int16,
      value: user.stats.pp < 32767 ? user.stats.pp : 0
    }
  ]
});
