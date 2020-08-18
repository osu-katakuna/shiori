const Parser = require('./Parse');
const { Type } = require('../PacketUtils');

const matchDataTemplate = [
  { parameter: "matchID", type: Type.Int16 },
  { parameter: "inProgress", type: Type.Byte },
  { parameter: "gameType", type: Type.Byte },
  { parameter: "mods", type: Type.UInt32 },
  { parameter: "name", type: Type.String },
  { parameter: "password", type: Type.String },
  { parameter: "beatmapName", type: Type.String },
  { parameter: "beatmapID", type: Type.UInt32 },
  { parameter: "beatmapHash", type: Type.String },
  { parameter: "slots",
    type: Type.ArrayOfValues,
    template: [
      { parameter: "status", type: Type.Byte },
      { parameter: "team", type: Type.Byte }
    ],
    length: 16
  }
];

const matchData2Template = [
  { parameter: "hostID", type: Type.Int32 },
  { parameter: "gameMode", type: Type.Byte },
  { parameter: "matchScoringType", type: Type.Byte },
  { parameter: "matchTeamType", type: Type.Byte },
  { parameter: "freeMods", type: Type.Byte }
];

module.exports = (data) => {
  const matchData = Parser.ParseDataFromTemplate(data, matchDataTemplate);
  var data = data.slice(Parser.CalculateOffset(data, matchDataTemplate));

  for(var i = 0; i < 16; i++) {
    // check if we have an player
    if(matchData.slots[i].status & 124) {
      matchData.slots[i].playerID = data.readUInt32LE();
      data = data.slice(4);
    } else {
      matchData.slots[i].playerID = -1;
    }
  }

  const matchData2 = Parser.ParseDataFromTemplate(data, matchData2Template);
  data = data.slice(Parser.CalculateOffset(data, matchData2Template));

  if(matchData2.freeMods) {
    for(var i = 0; i < 16; i++) {
      matchData.slots[i].mods = data.readUInt32LE();
      data = data.slice(4);
    }
  } else {
    for(var i = 0; i < 16; i++) {
      matchData.slots[i].mods = 0;
    }
  }

  const seed = data.readUInt32LE();

  return {
    ...matchData,
    ...matchData2,
    seed
  };
};
