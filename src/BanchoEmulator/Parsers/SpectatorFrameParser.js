const Parser = require('./Parse');
const { Type } = require('../PacketUtils');

const data_template = [
  { parameter: "extra", type: Type.Int32 },
  { parameter: "frames", type: Type.Int16 }
];

const frame_template = [
  { parameter: "b", type: Type.Byte },
  { parameter: "bt", type: Type.Byte },
  { parameter: "x", type: Type.Float },
  { parameter: "y", type: Type.Float },
  { parameter: "t", type: Type.Int32 }
];

module.exports = (data) => {
  var frames = [];
  var x = Parser.ParseDataFromTemplate(data, data_template);
  var fr = data.slice(6);

  for(var i = 0; i < x.frames; i++) {
    frames.push(Parser.ParseDataFromTemplate(fr, frame_template));
    fr = fr.slice(Parser.CalculateOffset(fr, frame_template));
  }

  var action = fr[0];
  var score = null;

  if(data.length >= 2) {
    const score_frame_template = [
  	  { parameter: "time", type: Type.Int32 },
  		{ parameter: "id", type: Type.Byte },
  		{ parameter: "count300", type: Type.Int16 },
  		{ parameter: "count100", type: Type.Int16 },
  		{ parameter: "count50", type: Type.Int16 },
  		{ parameter: "countGeki", type: Type.Int16 },
  		{ parameter: "countKatu", type: Type.Int16 },
  		{ parameter: "countMiss", type: Type.Int16 },
  		{ parameter: "totalScore", type: Type.Int32 },
  		{ parameter: "maxCombo", type: Type.Int16 },
  		{ parameter: "currentCombo", type: Type.Int16 },
  		{ parameter: "perfect", type: Type.Byte },
  		{ parameter: "hp", type: Type.Byte },
  		{ parameter: "tagByte", type: Type.Byte },
  		{ parameter: "usingScoreV2", type: Type.Byte }
  	];


  	const parsed = Parser.ParseDataFromTemplate(fr.slice(1), score_frame_template);
  	if(parsed.usingScoreV2) {
  		score_frame_template.push({ parameter: "comboPortion", type: Type.Int64 });
  		score_frame_template.push({ parameter: "bonusPortion", type: Type.Int64 });
  	}

    score = Parser.ParseDataFromTemplate(fr.slice(1), score_frame_template);
  }

  return {
    frames,
    action,
    score,
    extra: x.extra
  };
};
