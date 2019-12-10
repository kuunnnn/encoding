// BOM
// utf8 0xEF 0xBB 0xBF
// utf-16LE  0xFF 0xFE
// utf-16BE  0xFE 0xFF
// utf-32LE  0xFF 0xFE 0x00 0x00
// utf-32BE  0x00 0x00 0xFE 0xFF

/*
[utf-8](https://en.wikipedia.org/wiki/UTF-8)
Number 	Bits  First   Last      Byte 1	  Byte 2	  Byte 3	  Byte 4
1	      7	    U+0000	U+007F	  0xxxxxxx
2	      11	  U+0080	U+07FF	  110xxxxx	10xxxxxx
3	      16	  U+0800	U+FFFF	  1110xxxx	10xxxxxx	10xxxxxx
4	      21	  U+10000	U+10FFFF	11110xxx	10xxxxxx	10xxxxxx	10xxxxxx

[utf-16](https://en.wikipedia.org/wiki/UTF-16)
分为 2 个字节和 4 个字节, 4 个字节如下
U'= yyyyyyyyyxxxxxxxxxx // U-0x10000
W1 = 110110yyyyyyyyyy // 0xD800 + yyyyyyyyyy
W2 = 110111xxxxxxxxxx // 0xDC00 + xxxxxxxxxx
 */
const fromCodePoint = String.fromCodePoint;

function isExistUtf8BOM(bytes, i = 0) {
  return bytes[i] === 0xef && bytes[i + 1] === 0xbb && bytes[i + 2] === 0xbf;
}
function isExistUtf16leBOM(bytes, i = 0) {
  return bytes[i] === 0xff && bytes[i + 1] === 0xfe;
}
function isExistUtf16beBOM(bytes, i = 0) {
  return bytes[i] === 0xfe && bytes[i + 1] === 0xff;
}
function isExistUtf32leBOM(bytes, i = 0) {
  return (
    bytes[i] === 0xff &&
    bytes[i + 1] === 0xfe &&
    bytes[i + 2] === 0x00 &&
    bytes[i + 3] === 0x00
  );
}
function isExistUtf32beBOM(bytes, i = 0) {
  return (
    bytes[i] === 0x00 &&
    bytes[i + 1] === 0x00 &&
    bytes[i + 2] === 0xfe &&
    bytes[i + 3] === 0xff
  );
}
/**
 * to ISO-8859-1
 * @param bytes {Buffer|Uint8Array}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {string}
 */
function readBytesToISO88591(bytes, i, len) {
  if (!bytes) return "";
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len || len < 0) {
    len = bytes.length;
  }
  let result = "";
  while (i < len) {
    result += fromCodePoint(bytes[i]);
    i++;
  }
  return result;
}
/**
 * 二进制转 utf8 字符串
 * @param bytes {Buffer|Uint8Array}
 * @param i {Number?}
 * @param len {Number?}
 * @description 使用 String.fromCodePoint() 来获取对应的字符
 * @returns {string|string}
 */
function readBytesToUtf8(bytes, i, len) {
  if (!bytes) return "";
  let result = "";
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = bytes.length;
  }
  if (isExistUtf8BOM(bytes, i)) {
    i += 3;
  }
  while (i < len) {
    if (bytes[i] <= 0b0111_1111) {
      // 一字节 0xxxxxxx
      result += fromCodePoint(bytes[i]);
      i += 1;
    } else if (bytes[i] >= 0b1100_0000 && bytes[i] <= 0b1101_1111) {
      // 二字节 110xxxxx 10xxxxxx
      result += fromCodePoint(
        ((bytes[i] & 0b0001_1111) << 6) | (bytes[i + 1] & 0b0011_1111)
      );
      i += 2;
    } else if (bytes[i] >= 0b1110_0000 && bytes[i] <= 0b1110_1111) {
      // 三字节 1110xxxx 10xxxxxx 10xxxxxx
      result += fromCodePoint(
        ((bytes[i] & 0b0000_1111) << 12) |
          ((bytes[i + 1] & 0b0011_1111) << 6) |
          (bytes[i + 2] & 0b0011_1111)
      );
      i += 3;
    } else if (bytes[i] >= 0b1111_0000 && bytes[i] <= 0b1111_0111) {
      // 四字节 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      result += fromCodePoint(
        ((bytes[i] & 0b0000_0111) << 18) |
          ((bytes[i + 1] & 0b0011_1111) << 12) |
          ((bytes[i + 2] & 0b0011_1111) << 6) |
          (bytes[i + 3] & 0b0011_1111)
      );
      i += 4;
    } else {
      throw "错误的编码";
    }
  }
  return result;
}

/**
 * 字符串 to Utf16 little-endian 字节数组
 * @param bytes {Buffer|Uint8Array}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {string}
 */
function readBytesToUtf16LE(bytes, i, len) {
  if (!bytes) return "";
  let result = "";
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = bytes.length;
  }
  if (isExistUtf16leBOM(bytes, i)) {
    i += 2;
  }
  while (i < len) {
    if (bytes[i] <= 0xffff) {
      // 二字节
      result += fromCodePoint((bytes[i + 1] << 8) | bytes[i]);
      i += 2;
    } else if (bytes[i] >= 0x10000 && bytes[i] <= 0x10ffff) {
      // 四字节
      result += fromCodePoint(
        (((bytes[i + 2] & 0b00000011) << 18) |
          (bytes[i] << 10) |
          ((bytes[i + 3] & 0b00000011) << 8) |
          bytes[i + 2]) +
          0x10000
      );
      i += 4;
    } else {
      throw "错误的编码";
    }
  }
  return result;
}

/**
 * 字符串 to Utf16 big-endian 字节数组
 * @param bytes {Buffer|Uint8Array}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {string}
 */
function readBytesToUtf16BE(bytes, i, len) {
  if (!bytes) return "";
  let result = "";
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = bytes.length;
  }
  if (isExistUtf16beBOM(bytes, i)) {
    i += 2;
  }
  while (i < len) {
    if (bytes[i] <= 0xffff) {
      // 二字节
      result += fromCodePoint((bytes[i] << 8) | bytes[i + 1]);
      i += 2;
    } else if (bytes[i] >= 0x10000 && bytes[i] <= 0x10ffff) {
      // 四字节
      result += fromCodePoint(
        (((bytes[i + 3] & 0b0000_0011) << 18) |
          (bytes[i + 2] << 10) |
          ((bytes[i + 1] & 0b0000_0011) << 8) |
          bytes[i]) +
          0x10000
      );
      i += 4;
    } else {
      throw "错误的编码";
    }
  }
  return result;
}

/**
 * 字符串 to Utf32 little-endian 字节数组
 * @param bytes {Buffer|Uint8Array}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {string}
 */
function readBytesToUTF32LE(bytes, i, len) {
  if (!bytes) return "";
  let result = "";
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = bytes.length;
  }
  if (isExistUtf32leBOM(bytes, i)) {
    i += 4;
  }
  while (i < len) {
    result += fromCodePoint(
      (bytes[i + 3] << 24) |
        (bytes[i + 2] << 16) |
        (bytes[i + 1] << 8) |
        bytes[i]
    );
    i += 4;
  }
  return result;
}

/**
 * 字符串 to Utf32 bif-endian 字节数组
 * @param bytes {Buffer|Uint8Array}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {string}
 */
function readBytesToUTF32BE(bytes, i, len) {
  if (!bytes) return "";
  let result = "";
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = bytes.length;
  }
  if (isExistUtf32beBOM(bytes, i)) {
    i += 4;
  }
  while (i < len) {
    result += fromCodePoint(
      (bytes[i] << 24) |
        (bytes[i + 1] << 16) |
        (bytes[i + 2] << 8) |
        bytes[i + 3]
    );
    i += 4;
  }
  return result;
}

/**
 * 字符串 to Utf8 字节数组
 * @param str {String}
 * @param i {Number?}
 * @param len {Number?}
 * @description 使用 str.codePointAt( i ) 获取 codePoint
 * @returns {Uint8Array}
 */
function stringToUtf8Bytes(str, i, len) {
  if (!str) return [];
  const bytes = [0xef, 0xbb, 0xbf];
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = str.length;
  }
  while (i < len) {
    const code = str.codePointAt(i);
    i++;
    if (code <= 0x7f) {
      // 一个字节
      bytes.push(code);
    } else if (code >= 0x80 && code <= 0x7ff) {
      // 二个字节
      bytes.push(
        0b1100_0000 | ((code & 0b11111_000000) >> 6),
        0b1000_0000 | (code & 0b00000_111111)
      );
    } else if (code >= 0x800 && code <= 0xffff) {
      // 三个字节
      bytes.push(
        0b1110_0000 | ((code & 0b1111_000000_000000) >> 12),
        0b1000_0000 | ((code & 0b0000_111111_000000) >> 6),
        0b1000_0000 | (code & 0b0000_000000_111111)
      );
    } else if (code >= 0x10000 && code <= 0x10ffff) {
      // 四个字节
      bytes.push(
        0b1111_0000 | ((code & 0b111_000000_000000_000000) >> 18),
        0b1000_0000 | ((code & 0b000_111111_000000_000000) >> 12),
        0b1000_0000 | ((code & 0b000_000000_111111_000000) >> 6),
        0b1000_0000 | (code & 0b000_000000_000000_111111)
      );
    } else {
      throw "错误的CodePoint";
    }
  }
  return bytes;
}

/**
 * to utf16 big-endian
 * @param str {String}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {Array}
 */
function stringToUtf16BeBytes(str, i, len) {
  if (!str) return [];
  const bytes = [0xfe, 0xff];
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = str.length;
  }
  while (i < len) {
    const code = str.codePointAt(i);
    i++;
    if (code <= 0xffff) {
      // 二字节
      bytes.push(
        (code & 0b1111_1111_0000_0000) >> 8,
        code & 0b0000_0000_1111_1111
      );
    } else if (code >= 0x10000 && code <= 0x10ffff) {
      // 四字节
      const w1 =
        0xd800 + (((code - 0x10000) & 0b11_11111111_00_00000000) >> 10);
      const w2 = 0xdc00 + ((code - 0x10000) & 0b00_00000000_11_11111111);
      bytes.push(
        (w2 & 0b11111111_00000000) >> 8,
        w2 & 0b00000000_11111111,
        (w1 & 0b11111111_00000000) >> 8,
        w1 & 0b00000000_11111111
      );
    } else {
      throw "错误的CodePoint";
    }
  }
  return bytes;
}

/**
 * to utf16 little-endian
 * @param str {String}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {Array}
 */
function stringToUtf16LeBytes(str, i, len) {
  if (!str) return [];
  const bytes = [0xff, 0xfe];
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = str.length;
  }
  while (i < len) {
    const code = str.codePointAt(i);
    i++;
    if (code <= 0xffff) {
      // 二字节
      bytes.push(
        code & 0b0000_0000_1111_1111,
        (code & 0b1111_1111_0000_0000) >> 8
      );
    } else if (code >= 0x10000 && code <= 0x10ffff) {
      // 四字节
      const w1 =
        0xd800 + (((code - 0x10000) & 0b11_11111111_00_00000000) >> 10);
      const w2 = 0xdc00 + ((code - 0x10000) & 0b00_00000000_11_11111111);
      bytes.push(
        w1 & 0b00000000_11111111,
        (w1 & 0b11111111_00000000) >> 8,
        w2 & 0b00000000_11111111,
        (w2 & 0b11111111_00000000) >> 8
      );
    } else {
      throw "错误的CodePoint";
    }
  }
  return bytes;
}

/**
 * to utf32 big-endian
 * @param str {String}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {Array}
 */
function stringToUtf32BeBytes(str, i, len) {
  if (!str) return [];
  const bytes = [0x00, 0x00, 0xfe, 0xff];
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = str.length;
  }
  while (i < len) {
    const code = str.codePointAt(i);
    i++;
    bytes.push(
      (code & 0b11111111_00000000_00000000_00000000) >> 24,
      (code & 0b00000000_11111111_00000000_00000000) >> 16,
      (code & 0b00000000_00000000_11111111_00000000) >> 8,
      code & 0b00000000_00000000_00000000_11111111
    );
  }
  return bytes;
}

/**
 * to utf32 little-endian
 * @param str {String}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {Array}
 */
function stringToUtf32LeBytes(str, i, len) {
  if (!str) return [];
  const bytes = [0xff, 0xfe, 0x00, 0x00];
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len) {
    len = str.length;
  }
  while (i < len) {
    const code = str.codePointAt(i);
    i++;
    bytes.push(
      code & 0b00000000_00000000_00000000_11111111,
      (code & 0b00000000_00000000_11111111_00000000) >> 8,
      (code & 0b00000000_11111111_00000000_00000000) >> 16,
      (code & 0b11111111_00000000_00000000_00000000) >> 24
    );
  }
  return bytes;
}

/**
 * 同过 bom 来判断读取
 * @param bytes {Buffer|Uint8Array}
 * @param i {Number?}
 * @param len {Number?}
 * @returns {string}
 */
function readBytesByBom(bytes, i, len) {
  if (!bytes) return "";
  if (typeof i !== "number") {
    i = 0;
  }
  if (!len || len < 0) {
    len = bytes.length;
  }
  if (isExistUtf8BOM(bytes, i)) {
    return readBytesToUtf8(bytes, i + 3, len);
  } else if (isExistUtf32leBOM(bytes, i)) {
    return readBytesToUTF32LE(bytes, i + 4, len);
  } else if (isExistUtf16leBOM(bytes, i)) {
    return readBytesToUtf16LE(bytes, i + 2, len);
  } else if (isExistUtf16beBOM(bytes, i)) {
    return readBytesToUtf16BE(bytes, i + 2, len);
  } else if (isExistUtf32beBOM(bytes, i)) {
    return readBytesToUTF32BE(bytes, i + 4, len);
  } else {
    return readBytesToUtf8(bytes, i, len);
  }
}

module.exports = {
  readBytesToUtf16BE,
  readBytesToUtf16LE,
  readBytesToUTF32BE,
  readBytesToUTF32LE,
  readBytesToUtf8,
  readBytesToISO88591,
  readBytesByBom,
  stringToUtf16BeBytes,
  stringToUtf16LeBytes,
  stringToUtf32BeBytes,
  stringToUtf32LeBytes,
  stringToUtf8Bytes
};
