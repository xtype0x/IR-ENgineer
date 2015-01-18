var googleTrans = require('./googletrans.js').translate;

// var Segment = require('node-segment').Segment;
// var segment = new Segment();
// segment.useDefault();
// var segs = segment.doSegment('第一次用手機剪片，這效果感覺真不輸電腦啊！孝文唱的真開心啊，哈哈');
// console.log(segs[0]);

var word = '你我他';

var a = googleTrans(word[0]);
console.log(a);