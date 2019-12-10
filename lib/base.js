/**
 * to 16 进制的字符串形式
 * @param num {Number}
 * @returns {string}
 */
function toHex(num) {
  if (typeof num !== "number") return "";
  const bytes = "0123456789ABCDEF";
  const result = [];
  if (num < 10) {
    return "0x0" + num;
  }
  while (num !== 0) {
    result.push(bytes[num % 16]);
    num = Math.floor(num / 16);
  }
  return "0x" + result.reverse().join("");
}

/**
 * to 2 进制的字符串形式
 * @param num {Number}
 * @returns {string}
 */
function toBinary(num) {
  if (typeof num !== "number") return "";
  const result = [];
  while (num !== 0) {
    result.push(num % 2);
    num = Math.floor(num / 2);
  }
  return "0b" + result.reverse().join("");
}

/**
 * to 8 进制的字符串形式
 * @param num {Number}
 * @returns {string}
 */
function toEight(num) {
  if (typeof num !== "number") return "";
  const result = [];
  while (num !== 0) {
    result.push(num % 8);
    num = Math.floor(num / 8);
  }
  return "0o" + result.reverse().join("");
}

module.exports = {
  toEight,
  toHex,
  toBinary
};
