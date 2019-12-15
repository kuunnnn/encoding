const { toUtf8 } = require( "./unicode.t" );
// const ReservedWords = [
//   0x21, // !
//   0x23, // #
//   0x24, // $
//   0x26, // &
//   0x27, // '
//   0x28, // (
//   0x29, // )
//   0x2A, // *
//   0x2B, // +
//   0x2C, // ,
//   0x2F, // /
//   0x3A, // :
//   0x3B, // ;
//   0x3D, // =
//   0x3F, // ?
//   0x40, // @
//   0x5B, // [
//   0x5D, // ]
// ];
const ReservedWordsMap = {
  "!": 33,
  "#": 35,
  "$": 36,
  "&": 38,
  "'": 39,
  "(": 40,
  ")": 41,
  "*": 42,
  "+": 43,
  ",": 44,
  "/": 47,
  ":": 58,
  ";": 59,
  "=": 61,
  "?": 63,
  "@": 64,
  "[": 91,
  "]": 93
};

/**
 * 百分比 编码, 先转换成 utf8
 * @param str {String}
 * @description >>>> 2005年1月发布的RFC 3986，建议所有新的URI必须对未保留字符不加以百分号编码；其它字符建议先转换为UTF-8字节序列, 然后对其字节值使用百分号编码。此前的URI不受此标准的影响。
 */
function encode( str ) {
  let i = 0;
  let len = str.length;
  let bytes = [];
  let result = '';
  while ( i < len ) {
    bytes = toUtf8( str.codePointAt( i ) );
    // ascii 编码 可以只将 保留字编码
    if ( bytes.length === 1 ) {
      if ( ReservedWordsMap[ str[ i ] ] ) {
        result += "%" + bytes[ 0 ].toString( 16 )
      } else {
        result += str[ i ]
      }
    } else {
      for ( let byte of bytes ) {
        result += '%' + (byte.toString( 16 ))
      }
    }
    i++
  }
  return result
}

/**
 * 先解码到 utf8 解析不需要在意 ascii 中哪里编码了哪些没有编码
 * @param str {String}
 * @description 如果编码不符合 utf8 会抛出错误  会将+判断解析为" ", 而因为+是保留的会被编码
 */
function decode( str ) {
  let i = 0;
  let len = str.length;
  let s = '';
  let result = '';
  let byte = 0;
  while ( i < len ) {
    s = str[ i ];
    // ascii 没有编码的部分
    if ( s !== "%" ) {
      result += s === "+" ? " " : s;
      i++;
    } else {
      // 先读 3 个字节看看
      byte = parseInt( str.slice( i + 1, i + 3 ), 16 );
      if ( byte <= 0b0111_1111 ) {
        // 一字节 0xxxxxxx
        result += String.fromCodePoint( byte );
        i += 3;
      } else if ( byte >= 0b1100_0000 && byte <= 0b1101_1111 ) {
        // 二字节 110xxxxx 10xxxxxx
        result += String.fromCodePoint(
          ((byte & 0b0001_1111) << 6) |
          (parseInt( str.slice( i + 4, i + 6 ), 16 ) & 0b0011_1111)
        );
        i += 6;
      } else if ( byte >= 0b1110_0000 && byte <= 0b1110_1111 ) {
        // 三字节 1110xxxx 10xxxxxx 10xxxxxx
        result += String.fromCodePoint(
          ((byte & 0b0000_1111) << 12) |
          ((parseInt( str.slice( i + 4, i + 6 ), 16 ) & 0b0011_1111) << 6) |
          (parseInt( str.slice( i + 7, i + 9 ), 16 ) & 0b0011_1111)
        );
        i += 9;
      } else if ( byte >= 0b1111_0000 && byte <= 0b1111_0111 ) {
        // 四字节 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
        result += String.fromCodePoint(
          ((byte & 0b0000_0111) << 18) |
          ((parseInt( str.slice( i + 4, i + 6 ), 16 ) & 0b0011_1111) << 12) |
          ((parseInt( str.slice( i + 7, i + 9 ), 16 ) & 0b0011_1111) << 6) |
          (parseInt( str.slice( i + 10, i + 12 ), 16 ) & 0b0011_1111)
        );
        i += 12;
      } else {
        throw "错误的编码";
      }
    }
  }
  return result
}


const urlencoded = {
  decode,
  encode,
};
module.exports = urlencoded;
