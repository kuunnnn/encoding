const { toBase64, base64ToBytes } = require("../lib/base64");
describe("encode-base64", () => {
  test("tobase64 一个=", () => {
    const r = Buffer.from("word0").toString("base64");
    expect(toBase64(Buffer.from("word0").toJSON().data)).toEqual(r);
  });
  test("tobase64 二个=", () => {
    const r = Buffer.from("word").toString("base64");
    expect(toBase64(Buffer.from("word").toJSON().data)).toEqual(r);
  });
  test("tobase64 没有=", () => {
    const r = Buffer.from("wor").toString("base64");
    expect(toBase64(Buffer.from("wor").toJSON().data)).toEqual(r);
  });
  test("base64 to bytes", () => {
    const r1 = Buffer.from("wor");
    const r2 = Buffer.from("word");
    const r3 = Buffer.from("word1");
    expect(base64ToBytes(r1.toString("base64"))).toEqual(r1.toJSON().data);
    expect(base64ToBytes(r2.toString("base64"))).toEqual(r2.toJSON().data);
    expect(base64ToBytes(r3.toString("base64"))).toEqual(r3.toJSON().data);
  });
});
