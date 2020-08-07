const Parser = require('./Parse');
const { Type } = require('../PacketUtils');

module.exports = (data) => Parser.ParseDataFromTemplate(data, [
  { parameter: "type", type: Type.Byte },
  { parameter: "text", type: Type.String },
  { parameter: "hash", type: Type.String },
  { parameter: "mods", type: Type.UInt32 },
  { parameter: "gameMode", type: Type.Byte }
]);
