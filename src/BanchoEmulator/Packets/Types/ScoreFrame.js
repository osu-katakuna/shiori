const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (frame) => {
  const data = [
	  { value: frame.time, type: PacketGenerator.Type.Int32 },
		{ value: frame.id, type: PacketGenerator.Type.Byte },
		{ value: frame.count300, type: PacketGenerator.Type.Int16 },
		{ value: frame.count100, type: PacketGenerator.Type.Int16 },
		{ value: frame.count50, type: PacketGenerator.Type.Int16 },
		{ value: frame.countGeki, type: PacketGenerator.Type.Int16 },
		{ value: frame.countKatu, type: PacketGenerator.Type.Int16 },
		{ value: frame.countMiss, type: PacketGenerator.Type.Int16 },
		{ value: frame.totalScore, type: PacketGenerator.Type.Int32 },
		{ value: frame.maxCombo, type: PacketGenerator.Type.Int16 },
		{ value: frame.currentCombo, type: PacketGenerator.Type.Int16 },
		{ value: frame.perfect, type: PacketGenerator.Type.Byte },
		{ value: frame.hp, type: PacketGenerator.Type.Byte },
		{ value: frame.tagByte, type: PacketGenerator.Type.Byte },
		{ value: frame.usingScoreV2, type: PacketGenerator.Type.Byte }
  ];

  if(frame.usingScoreV2) {
    data.push({ value: frame.comboPortion, type: PacketGenerator.Type.Int64 });
		data.push({ value: frame.bonusPortion, type: PacketGenerator.Type.Int64 });
  }

  return PacketGenerator.BuildPacket({
    type: PacketConstant.server_matchScoreUpdate,
    data
  });
};
