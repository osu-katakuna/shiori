const { ReadString } = require('../Packets/Utils');

module.exports = (packet) => {
  var message = ReadString(packet, 2).toString();
  var channel = ReadString(packet, 4 + message.length).toString();

  return {
    message,
    channel
  };
}
