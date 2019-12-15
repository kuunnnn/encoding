# encoding

## [unicode](./lib/unicode.js)
* utf8
* utf16le
* utf16be
* utf32le
* utf32be

## [base64](./lib/base64.js)
每3 个字节 24 位 分为 4 组,每组 6 位, 然后找到这六位对应的编码,如最后一组不满 3 字节,则缺少一字节就添加一个=号
> 完整的Base64定义可见RFC 1421和RFC 2045。编码后的数据比原始数据略长，为原来的{\displaystyle {\frac {4}{3}}}{\frac {4}{3}}。在电子邮件中，根据RFC 822规定，每76个字符，还需要加上一个回车换行。可以估算编码后数据长度大约为原长的135.1%。