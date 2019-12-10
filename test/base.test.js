const { toEight, toBinary, toHex } = require("../lib/base");

describe("encode-base64", () => {
  test("to-hex", () => {
    expect(toHex(0xf)).toEqual("0xF");
    expect(toHex(0x56565)).toEqual("0x56565");
    expect(toHex(0x08)).toEqual("0x08");
    expect(toHex(0xfff)).toEqual("0xFFF");
  });
  test("to-binary", () => {
    expect(toBinary(0b1010100010)).toEqual("0b1010100010");
    expect(toBinary(0b11111)).toEqual("0b11111");
  });
  test("to-eight", () => {
    expect(toEight(0o1763)).toEqual("0o1763");
    expect(toEight(0o424)).toEqual("0o424");
  });
});
