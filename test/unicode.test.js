const {
  readBytesToUTF32BE,
  readBytesToUTF32LE,
  readBytesToUtf16LE,
  readBytesToUtf16BE,
  readBytesToUtf8,
  stringToUtf16BeBytes,
  stringToUtf16LeBytes,
  stringToUtf32BeBytes,
  stringToUtf32LeBytes,
  stringToUtf8Bytes
} = require("../lib/unicode");
describe("encode-string-prefix", () => {
  test("to-utf8", () => {
    expect(stringToUtf8Bytes(fCodePoint(0xf))).toEqual([0xef, 0xbb, 0xbf, 0xf]);
    expect(stringToUtf8Bytes(fCodePoint(0x7834))).toEqual([
      0xef,
      0xbb,
      0xbf,
      0xe7,
      0xa0,
      0xb4
    ]);
    // 应该是 js 还不支持 浏览器 0x2a6a5 这个字符length 是 2, node 12 length 也是 2
    // expect( stringToUtf8Bytes( fCodePoint( 0x2a6a5 ) ) ).toEqual( [ 0xEF ,0xBB ,0xBF,0xF0 ,0xAA ,0x9A, 0xA5] );
  });
  test("to-utf16-le", () => {
    expect(stringToUtf16LeBytes(fCodePoint(0xf))).toEqual([
      0xff,
      0xfe,
      0xf,
      0x00
    ]);
    expect(stringToUtf16LeBytes(fCodePoint(0x7834))).toEqual([
      0xff,
      0xfe,
      0x34,
      0x78
    ]);
    // 应该是 js 还不支持 浏览器 0x2a6a5 这个字符length 是 2, node 12 length 也是 2
    // expect( stringToUtf16LeBytes( fCodePoint( 0x2a6a5 ) ) ).toEqual( [ 0xff,0xfe, 0x53, 0x66 ] );
  });
  test("to-utf16-be", () => {
    expect(stringToUtf16BeBytes(fCodePoint(0xf))).toEqual([
      0xfe,
      0xff,
      0x00,
      0xf
    ]);
    expect(stringToUtf16BeBytes(fCodePoint(0x7834))).toEqual([
      0xfe,
      0xff,
      0x78,
      0x34
    ]);
    // 应该是 js 还不支持 浏览器 0x2a6a5 这个字符length 是 2, node 12 length 也是 2
    // expect( stringToUtf16BeBytes( fCodePoint( 0x2a6a5 ) ) ).toEqual( [0xfe,0xff, 0x66, 0x53 ] );
  });
  test("to-utf32-le", () => {
    expect(stringToUtf32LeBytes(fCodePoint(0x0041))).toEqual([
      0xff,
      0xfe,
      0x00,
      0x00,
      0x41,
      0x00,
      0x00,
      0x00
    ]);
    expect(stringToUtf32LeBytes(fCodePoint(0x7834))).toEqual([
      0xff,
      0xfe,
      0x00,
      0x00,
      0x34,
      0x78,
      0x00,
      0x00
    ]);
    expect(stringToUtf32LeBytes(fCodePoint(0x6653))).toEqual([
      0xff,
      0xfe,
      0x00,
      0x00,
      0x53,
      0x66,
      0x00,
      0x00
    ]);
    // 应该是 js 还不支持 浏览器 0x2a6a5 这个字符length 是 2, node 12 length 也是 2
    // expect( stringToUtf32LeBytes( fCodePoint( 0x2a6a5 ) ) ).toEqual( [0xFF, 0xFE, 0x00, 0x00, 0xa5, 0xa6, 0x02, 0x00 ] );
  });
  test("to-utf32-be", () => {
    expect(stringToUtf32BeBytes(fCodePoint(0x0041))).toEqual([
      0x00,
      0x00,
      0xfe,
      0xff,
      0x00,
      0x00,
      0x00,
      0x41
    ]);
    expect(stringToUtf32BeBytes(fCodePoint(0x7834))).toEqual([
      0x00,
      0x00,
      0xfe,
      0xff,
      0x00,
      0x00,
      0x78,
      0x34
    ]);
    expect(stringToUtf32BeBytes(fCodePoint(0x6653))).toEqual([
      0x00,
      0x00,
      0xfe,
      0xff,
      0x00,
      0x00,
      0x66,
      0x53
    ]);
    // 应该是 js 还不支持 浏览器 0x2a6a5 这个字符length 是 2, node 12 length 也是 2
    // expect( stringToUtf32BeBytes( fCodePoint( 0x2a6a5 ) ) ).toEqual( [ 0x00, 0x00, 0xFE,0xFF, 0x00, 0x02, 0xa6, 0xa5 ] );
  });
});

describe("encode-read-prefix", () => {
  test("utf8", () => {
    const str1 = Buffer.from("23423849fsdjlfksdjlfjds/'[]-=()", "utf8");
    expect(readBytesToUtf8(str1.toJSON().data)).toEqual(str1.toString());
    const str2 = Buffer.from(
      "UTF-16也是一种变长编码，对于一个Unicode字符被编码成1至2个码元，每个码元为16位。",
      "utf8"
    );
    expect(readBytesToUtf8(str2.toJSON().data)).toEqual(str2.toString());
  });
  test("utf16le", () => {
    const str1 = Buffer.from("23423849fsdjlfksdjlfjds/'[]-=()", "utf16le");
    expect(readBytesToUtf16LE(str1.toJSON().data)).toEqual(
      str1.toString("utf16le")
    );
    const str2 = Buffer.from(
      "UTF-16也是一种变长编码，对于一个Unicode字符被编码成1至2个码元，每个码元为16位。",
      "utf16le"
    );
    expect(readBytesToUtf16LE(str2.toJSON().data)).toEqual(
      str2.toString("utf16le")
    );
  });
  test("utf16be", () => {
    const b1 = [0x00, 0x41, 0x78, 0x34, 0x66, 0x53];
    expect(readBytesToUtf16BE(b1, 0, b1.length)).toEqual("A破晓");
    expect(readBytesToUtf16BE(b1, 0)).toEqual("A破晓");
    expect(readBytesToUtf16BE(b1)).toEqual("A破晓");
  });
  test("utf32le", () => {
    const b1 = [
      0x41,
      0x00,
      0x00,
      0x00,
      0x34,
      0x78,
      0x00,
      0x00,
      0x53,
      0x66,
      0x00,
      0x00
    ];
    expect(readBytesToUTF32LE(b1, 0, b1.length)).toEqual("A破晓");
    expect(readBytesToUTF32LE(b1, 0)).toEqual("A破晓");
    expect(readBytesToUTF32LE(b1)).toEqual("A破晓");
  });
  test("utf32be", () => {
    const b1 = [
      0x00,
      0x00,
      0x00,
      0x41,
      0x00,
      0x00,
      0x78,
      0x34,
      0x00,
      0x00,
      0x66,
      0x53
    ];
    expect(readBytesToUTF32BE(b1, 0, b1.length)).toEqual("A破晓");
    expect(readBytesToUTF32BE(b1, 0)).toEqual("A破晓");
    expect(readBytesToUTF32BE(b1)).toEqual("A破晓");
  });
});
