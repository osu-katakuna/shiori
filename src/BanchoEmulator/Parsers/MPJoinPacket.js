const Parser = require('./Parse');
const { Type } = require('../PacketUtils');

const data_template = [
  { parameter: "id", type: Type.Int32 },
  { parameter: "password", type: Type.String }
];

module.exports = (data) => Parser.ParseDataFromTemplate(data, data_template);
