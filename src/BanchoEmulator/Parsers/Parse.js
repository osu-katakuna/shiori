const Int64 = require("int64-buffer").Int64LE;
const UInt64 = require("int64-buffer").Uint64LE;
const { Type, TypeSizeCalculator } = require('../PacketUtils');
const { ReadString } = require('../Packets/Utils');

function Parse(value, p) {
  var offset = 0;
  var data = null;

  if(p.type == Type.String) {
    data = ReadString(value, 0);
    offset += data == null ? 1 : data.length + 2;
  } else if(p.type == Type.Byte) {
    data = value[offset];
    offset += 1;
  } else if(p.type == Type.Int32) {
    data = value.readInt32LE();
    offset += 4;
  } else if(p.type == Type.UInt32) {
    data = value.readUInt32LE();
    offset += 4;
  } else if(p.type == Type.Int16) {
    data = value.readInt16LE();
    offset += 2;
  } else if(p.type == Type.UInt16) {
    data = value.readUInt16LE();
    offset += 2;
  } else if(p.type == Type.Float) {
    data = value.readFloatLE();
    offset += 4;
  } else if(p.type == Type.Int64) {
    data = new Int64(value);
    offset += 8;
  } else if(p.type == Type.UInt64) {
    data = new UInt64(value);
    offset += 8;
  } else if(p.type == Type.Raw) {
    data = new Buffer.from(value);
    offset += data.length;
  }

  return { data, offset };
}

function CalculateOffset(data, template) {
  var offset = 0;

  template.forEach(x => {
    const NewData = data.slice(offset);

    if(x.type === Type.ArrayOfValues) {
      x.template.forEach(template => {
        for(var i = 0; i < x.length; i++) {
          if(template.condition != undefined) {
            offset += template.condition(Parse(NewData, template).data, null, i) == false ? Parse(NewData, template).offset : 1;
          } else {
            offset += Parse(NewData, template).offset;
          }
        }
      });
      return;
    }

    if(x.condition == undefined) {
      offset += Parse(NewData, x).offset;
    } else {
      offset += x.condition(Parse(NewData, x).data, null) == true ? Parse(NewData, x).offset : 0;
    }
  });

  return offset;
}

function ParseDataFromTemplate(data, template) {
  var obj = {};
  var offset = 0;

  template.forEach(x => {
    var NewData = data.slice(offset);

    if(x.type === Type.ArrayOfValues) {
      x.template.forEach(template => {
        !obj[x.parameter] && (obj[x.parameter] = []);
        for(var i = 0; i < x.length; i++) {
          !obj[x.parameter][i] && (obj[x.parameter][i] = {}); // create empty object
          if(template.condition != undefined) {
            obj[x.parameter][i][template.parameter] = template.condition(Parse(NewData, template).data, obj, i) == false ? Parse(NewData, template).data : null; // run condition then evaluate the contents.
            offset += template.condition(Parse(NewData, template).data, obj, i) == false ? Parse(NewData, template).offset : 1;
            // false = show parsed value
            // true = null
          } else {
            obj[x.parameter][i][template.parameter] = Parse(NewData, template).data; // set value of that object
            offset += Parse(NewData, template).offset;
            NewData = data.slice(offset);
          }
        }
      });
      return;
    }

    if(x.condition == undefined) {
      obj[x.parameter] = Parse(NewData, x).data;
      offset += Parse(NewData, x).offset;
    } else {
      obj[x.parameter] = x.condition(Parse(NewData, x).data, obj) == true ? Parse(NewData, x).data : null; // run condition then evaluate the contents.
      offset += x.condition(Parse(NewData, x).data, obj) == true ? Parse(NewData, x).offset : 0;
    }
  });

  return obj;
}

module.exports = {
  ParseDataFromTemplate,
  CalculateOffset
};
