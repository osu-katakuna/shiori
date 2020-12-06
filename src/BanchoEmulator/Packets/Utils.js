function uleb128Encode(num) {
	if(num == 0) return new Buffer.from(0x00);

	var arr = new Buffer.alloc(16);
	var length = 0;
	var offset = 0;

	while(num > 0) {
		arr[offset] = num & 127;
		offset += 1;
		num = num >> 7;
		num != 0 && (arr[length] = arr[length] | 128);
		length += 1;
	}

  return arr.slice(0, length);
}

function ReadString(packet, offset) {
	var p = packet.slice(offset);
	
	if(p[0] == 0x00) {
		return null;
	}

	if(p[0] == 0x0B) {
		if(p[1] == 0x00) {
			return "";
		} else {
			return p.slice(2, 2 + p[1]).toString();
		}
	} else {
		return ReadString(packet, offset + 1);
	}
}

function PackString(str) {
	if(str == null || str == '') {
		return new Buffer.from([0x00]);
	} else {
		return new Buffer.concat([new Buffer.from([0x0B]),
			uleb128Encode(str.length),
			new Buffer.from(str)
		]);
	}
}

module.exports = {
  PackString,
  ReadString
}
