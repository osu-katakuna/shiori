const MatchInfo = require('./MatchInfo');
const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (match) => PacketGenerator.BuildPacket({
  type: PacketConstant.server_matchJoinSuccess,
  data: [
    {
      type: PacketGenerator.Type.Raw,
      value: MatchInfo(match).slice(7)
    }
  ]
});
