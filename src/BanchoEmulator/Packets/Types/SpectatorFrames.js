const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (frame) => {
  var template = [
    {
      type: PacketGenerator.Type.Int32,
      value: frame.extra
    },
    {
      type: PacketGenerator.Type.Int16,
      value: frame.frames.length
    }
  ];

  frame.frames.forEach(f => {
    [
      {
        type: PacketGenerator.Type.Byte,
        value: f.b
      },
      {
        type: PacketGenerator.Type.Byte,
        value: f.bt
      },
      {
        type: PacketGenerator.Type.Float,
        value: f.x
      },
      {
        type: PacketGenerator.Type.Float,
        value: f.y
      },
      {
        type: PacketGenerator.Type.Int32,
        value: f.t
      },
    ].forEach(x => template.push(x));
  });

  template.push({
    type: PacketGenerator.Type.Byte,
    value: frame.action
  });

  if(frame.score != null) {
    const scoreTemplate = [
  	  { value: frame.score.time, type: PacketGenerator.Type.Int32 },
  		{ value: frame.score.id, type: PacketGenerator.Type.Byte },
  		{ value: frame.score.count300, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.count100, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.count50, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.countGeki, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.countKatu, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.countMiss, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.totalScore, type: PacketGenerator.Type.Int32 },
  		{ value: frame.score.maxCombo, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.currentCombo, type: PacketGenerator.Type.Int16 },
  		{ value: frame.score.perfect, type: PacketGenerator.Type.Byte },
  		{ value: frame.score.hp, type: PacketGenerator.Type.Byte },
  		{ value: frame.score.tagByte, type: PacketGenerator.Type.Byte },
  		{ value: frame.score.usingScoreV2, type: PacketGenerator.Type.Byte }
    ];

    if(frame.score.usingScoreV2) {
      scoreTemplate.push({ value: frame.score.comboPortion, type: PacketGenerator.Type.Int64 });
  		scoreTemplate.push({ value: frame.score.bonusPortion, type: PacketGenerator.Type.Int64 });
    }

    scoreTemplate.forEach(x => template.push(x));
  }

  return PacketGenerator.BuildPacket({
    type: PacketConstant.server_spectateFrames,
    data: template
  });
}
