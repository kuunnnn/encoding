/**
 * to utf16 小端的字节形式
 * @param code {Number}
 * @returns {Array}
 */
function toUtf16Le(code) {
  if (typeof code !== "number") return [];
  const bytes = [];
  if (code <= 0xffff) {
    // 二字节
    bytes.push(
      (code & 0b1111_1111_0000_0000) >> 8,
      code & 0b0000_0000_1111_1111
    );
  } else if (code >= 0x10000 && code <= 0x10ffff) {
    // 四字节
    const w1 = 0xd800 + (((code - 0x10000) & 0b11_11111111_00_00000000) >> 10);
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
  return bytes;
}

/**
 * to utf16 大端的字节形式
 * @param code {Number}
 * @returns {Array}
 */
function toUtf16Be(code) {
  if (typeof code !== "number") return [];
  const bytes = [];
  if (code <= 0xffff) {
    // 二字节
    bytes.push(
      code & 0b0000_0000_1111_1111,
      (code & 0b1111_1111_0000_0000) >> 8
    );
  } else if (code >= 0x10000 && code <= 0x10ffff) {
    // 四字节
    const w1 = 0xd800 + (((code - 0x10000) & 0b11_11111111_00_00000000) >> 10);
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
  return bytes;
}

/**
 * to utf32 小端的字节形式
 * @param code {Number}
 * @returns {Array}
 */
function toUtf32Le(code) {
  if (typeof code !== "number") return [];
  const bytes = [];
  bytes.push(
    code & 0b00000000_00000000_00000000_11111111,
    (code & 0b00000000_00000000_11111111_00000000) >> 8,
    (code & 0b00000000_11111111_00000000_00000000) >> 16,
    (code & 0b11111111_00000000_00000000_00000000) >> 24
  );
  return bytes;
}

/**
 * to utf32 大端的字节形式
 * @param code {Number}
 * @returns {Array}
 */
function toUtf32Be(code) {
  if (typeof code !== "number") return [];
  const bytes = [];
  bytes.push(
    (code & 0b11111111_00000000_00000000_00000000) >> 24,
    (code & 0b00000000_11111111_00000000_00000000) >> 16,
    (code & 0b00000000_00000000_11111111_00000000) >> 8,
    code & 0b00000000_00000000_00000000_11111111
  );
  return bytes;
}

/**
 * to utf8 的字节形式
 * @param code {Number}
 * @returns {Array}
 */
function toUtf8(code) {
  if (typeof code !== "number") return [];
  const bytes = [];
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
  }
  return bytes;
}

module.exports = {
  toUtf8,
  toUtf16Le,
  toUtf16Be,
  toUtf32Le,
  toUtf32Be
};
