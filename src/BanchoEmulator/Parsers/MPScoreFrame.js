const Parser = require('./Parse');
const { Type } = require('../PacketUtils');

module.exports = (data) => {
	const template = [
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


	const parsed = Parser.ParseDataFromTemplate(data, template);
	if(parsed.usingScoreV2) {
		template.push({ parameter: "comboPortion", type: Type.Int64 });
		template.push({ parameter: "bonusPortion", type: Type.Int64 });
	}

	return Parser.ParseDataFromTemplate(data, template);
};
