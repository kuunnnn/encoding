const {
  toEight,
  toBinary,
  toHex,
  IEEE754Float32_decode,
  float64ToBinary,
  IEEE754Float32_encode,
} = require("../lib/base");

describe("进制转换", () => {
  test("IEEE 754 float32", () => {
    expect(IEEE754Float32_encode(1.25)).toEqual(
      "00111111101000000000000000000000"
    );
    expect(IEEE754Float32_decode("00111111101000000000000000000000")).toEqual(
      1.25
    );
    expect(IEEE754Float32_encode(1.8)).toEqual(
      "00111111111001100110011001100110"
    );
    expect(IEEE754Float32_decode("00111111111001100110011001100110")).toEqual(
      1.7999999523162842
    );
  });

  test("float 64 二进制", () => {
    expect(float64ToBinary(1.345)).toEqual((1.345).toString("2"));
  });

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
