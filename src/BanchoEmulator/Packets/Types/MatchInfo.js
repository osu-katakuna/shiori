const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (match) => {
  var data = [
    {
      type: PacketGenerator.Type.Int16,
      value: match.id
    },
    {
      type: PacketGenerator.Type.Byte,
      value: match.inProgress
    },
    {
      type: PacketGenerator.Type.Byte,
      value: 0
    },
    {
      type: PacketGenerator.Type.UInt32,
      value: match.mods
    },
    {
      type: PacketGenerator.Type.String,
      value: match.name
    },
    {
      type: PacketGenerator.Type.String,
      value: match.password
    },
    {
      type: PacketGenerator.Type.String,
      value: match.beatmapName
    },
    {
      type: PacketGenerator.Type.Int32,
      value: match.beatmapID
    },
    {
      type: PacketGenerator.Type.String,
      value: match.beatmapMD5
    }
  ];

  for(var i = 0; i < 16; i++) {
    data.push({
      type: PacketGenerator.Type.Byte,
      value: match.slots[i].status
    });
  }

  for(var i = 0; i < 16; i++) {
    data.push({
      type: PacketGenerator.Type.Byte,
      value: match.slots[i].team
    });
  }

  for(var i = 0; i < 16; i++) {
    if(match.slots[i].userID > -1) {
      data.push({
        type: PacketGenerator.Type.UInt32,
        value: match.slots[i].userID
      });
    }
  }

  data.push({
    type: PacketGenerator.Type.UInt32,
    value: match.hostUserID
  });

  data.push({
    type: PacketGenerator.Type.Byte,
    value: match.gameMode
  });

  data.push({
    type: PacketGenerator.Type.Byte,
    value: match.matchScoringType
  });

  data.push({
    type: PacketGenerator.Type.Byte,
    value: match.matchTeamType
  });

  data.push({
    type: PacketGenerator.Type.Byte,
    value: match.matchModMode
  });

  if(match.matchModMode == 1) {
    for(var i = 0; i < 16; i++) {
      data.push({
        type: PacketGenerator.Type.UInt32,
        value: match.slots[i].mods
      });
    }
  }

  data.push({
    type: PacketGenerator.Type.UInt32,
    value: match.seed
  });

  return PacketGenerator.BuildPacket({
    type: PacketConstant.server_updateMatch,
    data
  });
};
