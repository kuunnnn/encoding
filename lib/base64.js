const BASE64_CHAR_LIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE64_CHAR_INDEX_MAP = {
  "0": 52,
  "1": 53,
  "2": 54,
  "3": 55,
  "4": 56,
  "5": 57,
  "6": 58,
  "7": 59,
  "8": 60,
  "9": 61,
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
  a: 26,
  b: 27,
  c: 28,
  d: 29,
  e: 30,
  f: 31,
  g: 32,
  h: 33,
  i: 34,
  j: 35,
  k: 36,
  l: 37,
  m: 38,
  n: 39,
  o: 40,
  p: 41,
  q: 42,
  r: 43,
  s: 44,
  t: 45,
  u: 46,
  v: 47,
  w: 48,
  x: 49,
  y: 50,
  z: 51,
  "+": 62,
  "/": 63
};
/**
 * 字节转 base64
 * @param bytes {Array<Number>}
 * @returns {string}
 */
function toBase64(bytes) {
  const len = bytes.length;
  let i = 0;
  let result = "";
  let j = 0;
  let w = 0;
  while (i < len - 3) {
    w = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    result += BASE64_CHAR_LIST[(w & 0b11111100_00000000_00000000) >> 18];
    result += BASE64_CHAR_LIST[(w & 0b00000011_11110000_00000000) >> 12];
    result += BASE64_CHAR_LIST[(w & 0b00000000_00001111_11000000) >> 6];
    result += BASE64_CHAR_LIST[w & 0b00000000_00000000_00111111];
    j += 4;
    // 根据RFC 822规定，每76个字符，还需要加上一个回车换行。
    if (j === 76) {
      result += "\n";
      j = 0;
    }
    i += 3;
  }
  if (len - i === 3) {
    w = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    result += BASE64_CHAR_LIST[(w & 0b11111100_00000000_00000000) >> 18];
    result += BASE64_CHAR_LIST[(w & 0b00000011_11110000_00000000) >> 12];
    result += BASE64_CHAR_LIST[(w & 0b00000000_00001111_11000000) >> 6];
    result += BASE64_CHAR_LIST[w & 0b00000000_00000000_00111111];
  }
  if (len - i === 2) {
    w = (bytes[i] << 16) | (bytes[i + 1] << 8);
    result += BASE64_CHAR_LIST[(w & 0b11111100_00000000_00000000) >> 18];
    result += BASE64_CHAR_LIST[(w & 0b00000011_11110000_00000000) >> 12];
    result += BASE64_CHAR_LIST[(w & 0b00000000_00001111_11000000) >> 6];
    result += "=";
  }
  if (len - i === 1) {
    w = bytes[i] << 16;
    result += BASE64_CHAR_LIST[(w & 0b11111100_00000000_00000000) >> 18];
    result += BASE64_CHAR_LIST[(w & 0b00000011_11110000_00000000) >> 12];
    result += "==";
  }
  return result;
}

/**
 * base64 To bytes
 * @param str {String}
 * @returns {Array<Number>}
 */
function base64ToBytes(str) {
  str = str.replace("\n", "");
  const len = str.length;
  let i = 0;
  let w = 0;
  const pad = "=".charCodeAt(0);
  const bytes = [];
  while (i < len - 4) {
    w =
      (BASE64_CHAR_INDEX_MAP[str[i]] << 18) |
      (BASE64_CHAR_INDEX_MAP[str[i + 1]] << 12) |
      (BASE64_CHAR_INDEX_MAP[str[i + 2]] << 6) |
      BASE64_CHAR_INDEX_MAP[str[i + 3]];
    bytes.push(
      (w & 0b11111111_00000000_00000000) >> 16,
      (w & 0b00000000_11111111_00000000) >> 8,
      w & 0b00000000_00000000_11111111
    );
    i += 4;
  }
  if (str.charCodeAt(i + 2) === pad && str.charCodeAt(i + 3) === pad) {
    w =
      (BASE64_CHAR_INDEX_MAP[str[i]] << 18) |
      (BASE64_CHAR_INDEX_MAP[str[i + 1]] << 12);
    bytes.push((w & 0b11111111_00000000_00000000) >> 16);
  } else if (str.charCodeAt(i + 3) === pad) {
    w =
      (BASE64_CHAR_INDEX_MAP[str[i]] << 18) |
      (BASE64_CHAR_INDEX_MAP[str[i + 1]] << 12) |
      (BASE64_CHAR_INDEX_MAP[str[i + 2]] << 6);
    bytes.push(
      (w & 0b11111111_00000000_00000000) >> 16,
      (w & 0b00000000_11111111_00000000) >> 8
    );
  } else {
    w =
      (BASE64_CHAR_INDEX_MAP[str[i]] << 18) |
      (BASE64_CHAR_INDEX_MAP[str[i + 1]] << 12) |
      (BASE64_CHAR_INDEX_MAP[str[i + 2]] << 6) |
      BASE64_CHAR_INDEX_MAP[str[i + 3]];
    bytes.push(
      (w & 0b11111111_00000000_00000000) >> 16,
      (w & 0b00000000_11111111_00000000) >> 8,
      w & 0b00000000_00000000_11111111
    );
  }
  return bytes;
}

module.exports = {
  toBase64,
  base64ToBytes
};
