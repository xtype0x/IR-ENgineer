var Segment = require('node-segment').Segment;
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

// 开始分词
var segs = segment.doSegment('第一次用手機剪片，這效果感覺真不輸電腦啊！孝文唱的真開心啊，哈哈');
console.log(segs[0]);