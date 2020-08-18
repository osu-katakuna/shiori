const PacketGenerator = require('../PacketGenerator');
const PacketConstant = require('../PacketConstants');

module.exports = (match) => {
  var data = [{
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
      value: match.password != null && match.password.length > 0 ? " " : ""
    },
    {
      type: PacketGenerator.Type.String,
      value: match.beatmap.name
    },
    {
      type: PacketGenerator.Type.Int32,
      value: match.beatmap.id
    },
    {
      type: PacketGenerator.Type.String,
      value: match.beatmap.hash
    }
  ];

  for (var i = 0; i < 16; i++) {
    data.push({
      type: PacketGenerator.Type.Byte,
      value: match.getSlot(i).status
    });
  }

  for (var i = 0; i < 16; i++) {
    data.push({
      type: PacketGenerator.Type.Byte,
      value: match.getSlot(i).team
    });
  }

  for (var i = 0; i < 16; i++) {
    if (match.getSlot(i).status & 124) {
      data.push({
        type: PacketGenerator.Type.UInt32,
        value: match.getSlot(i).player.user.id
      });
    }
  }

  data = [
    ...data,
    {
      type: PacketGenerator.Type.UInt32,
      value: match.host == null ? -1 : match.host.user.id
    }, {
      type: PacketGenerator.Type.Byte,
      value: match.gameMode
    }, {
      type: PacketGenerator.Type.Byte,
      value: match.winCondition
    }, {
      type: PacketGenerator.Type.Byte,
      value: match.teamMode
    }, {
      type: PacketGenerator.Type.Byte,
      value: match.freeMod
    }
  ];

  if (match.freeMod) {
    for (var i = 0; i < 16; i++) {
      data.push({
        type: PacketGenerator.Type.UInt32,
        value: match.getSlot(i).mods
      });
    }
  }

  data.push({
    type: PacketGenerator.Type.UInt32,
    value: match.seed
  });

  return PacketGenerator.BuildPacket({
    type: PacketConstant.server_newMatch,
    data
  });
};
