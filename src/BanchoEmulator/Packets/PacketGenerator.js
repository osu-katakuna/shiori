const Int64 = require("int64-buffer").Int64LE;
const UInt64 = require("int64-buffer").Uint64LE;
const { PackString, ReadString } = require('./Utils');
const { Type, TypeSizeCalculator } = require('../PacketUtils');

function BuildPacket(__packet) {
  var data_size = 0;
  __packet.data.forEach((p) => { data_size += TypeSizeCalculator(p.type, p.value); }); // calculate packet size

  var packet = new Buffer.alloc(7 + data_size);

  var offset = 7; // start at 7
  var x = 0;
  packet.writeInt16LE(__packet.type, 0); // packet type
  packet.writeInt8(0x00, 2);
  packet.writeInt32LE(data_size, 3); // data_size

  __packet.data.forEach((p) => {
    if(p.type == Type.String) {
      PackString(p.value).copy(packet, offset);
    } else if(p.type == Type.Byte) {
      packet[offset] = p.value;
    } else if(p.type == Type.Int32) {
      packet.writeInt32LE(p.value, offset);
    } else if(p.type == Type.UInt32) {
      packet.writeUInt32LE(p.value, offset);
    } else if(p.type == Type.Int16) {
      packet.writeInt16LE(p.value, offset);
    } else if(p.type == Type.UInt16) {
      packet.writeUInt16LE(p.value, offset);
    } else if(p.type == Type.Float) {
      packet.writeFloatLE(p.value, offset);
    } else if(p.type == Type.Int64) {
      new Int64(p.value).toBuffer().copy(packet, offset);
    } else if(p.type == Type.UInt64) {
      new UInt64(p.value).toBuffer().copy(packet, offset);
    } else if(p.type == Type.Raw) {
      new Buffer.from(p.value).copy(packet, offset);
    }
    offset += TypeSizeCalculator(p.type, p.value)
    x++;
  });

  return packet;
}

module.exports = {
  BuildPacket,
  Type
}
