const { PackString } = require('../Packets/Utils');

const Type = {
  String: 0,
  Byte: 1,
  Int8: 1,
  Raw: 2,
  Int32: 3,
  Int64: 4,
  Float: 5,
  Int16: 6,
  UInt32: 7,
  UInt64: 8,
  ArrayOfValues: 9,
  UInt16: 10,
};

function TypeSizeCalculator(type, data) {
  if(type == Type.String) {
    return PackString(data).length;
  } else if(type == Type.Byte) {
    return 1;
  } else if(type == Type.Raw) {
    return data.length;
  } else if(type == Type.Int32 || type == Type.UInt32) {
    return 4;
  } else if(type == Type.Int16 || type == Type.UInt16) {
    return 2;
  } else if(type == Type.Float) {
    return 4;
  } else if(type == Type.Int64 || type == Type.UInt64) {
    return 8;
  }
  
  return 0;
}

module.exports = {
  Type,
  TypeSizeCalculator
}
