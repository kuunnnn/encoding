/**
 * to 16 进制的字符串形式
 * @param num {Number}
 * @returns {string}
 * @todo 负数
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

/**
 * @param num {Number} 正负,需要是整数
 * @description 负数的范围是 32
 */
function int32ToBinary( num ) {
  let isNegative = false;
  if ( num === 0 ) {
    return '0'
  }
  if ( num < 0 ) {
    // 0x80000000 符号位
    // 取补码(缺少符号位) 负数是以补码存储的
    num = (~(0x80000000 | (-num)) + 1);
    isNegative = true;
  }
  let result = '';
  while ( num !== 0 ) {
    result = (num % 2) + result;
    num = Math.floor( num / 2 );
  }
  return isNegative ? '1' + result : result;
}

/**
 * 无符号整数的二进制 转 10 进制
 * @param str {String}
 * @return {number}
 */
function uintBinaryDecode( str ) {
  if ( str[ 0 ] === "0" && str[ 1 ] === "b" ) {
    str = str.substr( 2 )
  }
  str = str.replace( /[_\-,]/g, "" );
  let i = str.length - 1;
  let len = str.length;
  let result = 0;
  while ( i >= 0 ) {
    if ( str[ i ] === "1" ) {
      result += (Math.pow( 2, len - i - 1 ));
    }
    i--;
  }
  return result
}

/**
 * 无符号小数的二进制 转 10 进制
 * @param str {String}
 * @return {number}
 */
function uDecimalBinaryDecode( str ) {
  if ( str[ 0 ] === "0" && str[ 1 ] === "b" ) {
    str = str.substr( 2 )
  }
  str = str.replace( /[_\-,]/g, "" );
  let i = 0;
  let len = str.length;
  let result = 0;
  while ( i < len ) {
    if ( str[ i ] === '1' ) {
      result += 2 ** -(i + 1);
    }
    i++;
  }
  return result
}

/**
 * 64位小数 转二进制
 * @param num {Number}
 * @param Bit {Number}
 * @return {string}
 */
function float64ToBinary( num , Bit=52) {
  let bit = 0;
  let integer = int32ToBinary( Math.floor( num ) );
  let decimal_value = num - Math.floor( num );
  let decimal = '';
  let next_decimal_value = 0;
  let beforeBit = 0;
  let before1Bool = false;
  // todo: 如果是 0.00001 这种小数, 在 float64 或 32 位应移位会导致精度缺失
  //  所以要保证小数点后面 的第一个 1 后面要有足够的长度
  while ( bit < (Bit + beforeBit) && decimal_value !== 0 ) {
    decimal_value *= 2;
    next_decimal_value = Math.floor( decimal_value );
    decimal_value = decimal_value - next_decimal_value;
    decimal += next_decimal_value.toString();
    if ( next_decimal_value === 0 && !before1Bool ) {
      beforeBit++;
    }
    if ( next_decimal_value === 1 ) {
      before1Bool = true
    }
    bit++;
  }
  return integer + '.' + decimal
}

/**
 * IEEE754 float64 encoding to binary
 * @param num {Number}
 * @return {string}
 */
function float64_encode( num ) {
  // Sign ： 1 bit（第63个bit）
  let sign = num > 0 ? "0" : '1';
  // Exponent ：11 bits （第 62 至 52 共 11 个bits）
  const binary = float64ToBinary( num );
  let index = Math.max( binary.indexOf( '1' ), 1 );
  let dotIndex = binary.indexOf( '.' );
  let exponent = int32ToBinary( dotIndex - index + 1023 );
  if (exponent.length >= 11) {
    exponent = exponent.slice(0,11)
  }else {
    exponent = new Array( 11 - Math.min( exponent.length, 11 ) ).fill( '0' ).join( "" )+exponent;
  }
  // Fraction ：52 bits （第 51 至 0 共 52 个bits）
  let fraction = "";
  if ( dotIndex > index ) {
    fraction = binary.slice( index ).replace( '.', '' )
  } else {
    fraction = binary.slice( index + 1 )
  }
  if ( fraction.length >= 52 ) {
    fraction = fraction.slice( 0, 52 )
  } else {
    fraction += new Array( 52 - Math.min( fraction.length, 52 ) ).fill( '0' ).join( "" );
  }
  return sign +  exponent + fraction
}

/**
 * IEEE754 float64 decode to Number
 * @param numb {String}
 * @return {Number}
 */
function float64_decode( numb ) {
  if ( numb[ 0 ] === "0" && numb[ 1 ] === "b" ) {
    numb = numb.slice( 2 )
  }
  // Sign ： 1 bit（第31个bit）
  let sign = numb[ 0 ] === '1' ? 1 : 0;
  // Exponent ：11 bits （第 62 至 52 共 11 个bits）
  let exponent = uintBinaryDecode( numb.slice( 1, 12 ) );
  // Fraction ：52 bits （第 51 至 0 共 52 个bits）
  let fraction = uDecimalBinaryDecode( numb.slice( 12 ) );
  return ((-1) ** sign) * (1 + fraction) * (2 ** (exponent - 1023))
}

/**
 * IEEE754 float64 encoding to binary
 * @param num {Number}
 * @return {string}
 * @todo 和 64 合并到一个函数
 */
function float32_encode(num) {
  // Sign ： 1 bit（第31个bit）
  let sign = num > 0 ? "0" : '1';
  // Exponent ：11 bits （第 30 至 23 共 8 个bits）
  const binary = float64ToBinary( num ,23);
  let index = Math.max( binary.indexOf( '1' ), 1 );
  let dotIndex = binary.indexOf( '.' );
  let exponent = int32ToBinary( dotIndex - index + 127 );
  if (exponent.length >= 8) {
    exponent = exponent.slice(0,8)
  }else {
    exponent = new Array( 8 - Math.min( exponent.length, 8 ) ).fill( '0' ).join( "" )+exponent;
  }
  // Fraction ：52 bits （第 51 至 0 共 52 个bits）
  let fraction = "";
  if ( dotIndex > index ) {
    fraction = binary.slice( index ).replace( '.', '' )
  } else {
    fraction = binary.slice( index + 1 )
  }
  if ( fraction.length >= 23 ) {
    fraction = fraction.slice( 0, 23 )
  } else {
    fraction += new Array( 23 - Math.min( fraction.length, 23 ) ).fill( '0' ).join( "" );
  }
  return sign +  exponent + fraction
}

/**
 * IEEE754 float64 decode to Number
 * @param numb {String}
 * @return {Number}
 * @todo 现在不能及时 0.0 以后的
 * @todo 和 64 合并到一个函数
 */
function float32_decode(numb) {
  if ( numb[ 0 ] === "0" && numb[ 1 ] === "b" ) {
    numb = numb.slice( 2 )
  }
  // Sign ： 1 bit（第31个bit）
  let sign = numb[ 0 ] === '1' ? 1 : 0;
  let exponent = uintBinaryDecode( numb.slice( 1, 9 ) );
  let fraction = uDecimalBinaryDecode( numb.slice( 9 ) );
  // 1 * 1.2799999713897705 * 0.001953125 js 0.0024999999441206455
  // 1 * 1.2799999713897705 * 0.001953125 go +2.500000e-003
  return ((-1) ** sign) * (1 + fraction) * (2 ** (exponent - 127))
}

//>>>>>> [在线查看的二进制形式的网站](http://www.binaryconvert.com/convert_unsigned_short.html)
module.exports = {
  toEight,
  toHex,
  toBinary,
  uintBinaryDecode,
  uDecimalBinaryDecode,
  float32_decode,
  float64_decode,
  float64_encode,
  float32_encode,
  float64ToBinary,
  int32ToBinary,
};
