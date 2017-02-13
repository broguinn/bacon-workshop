K = require('kefir');
_ = require('lodash');

const add = (a, b) => a + b;
const countTen = K.sequentially(100, _.times(10));

countTen.scan(add, 0)
.log('scan');

countTen.toProperty(() => 100)
.scan(add, 0)
.log('propertyScan');
