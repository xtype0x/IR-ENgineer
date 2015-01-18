var Segment = require('node-segment').Segment;
var request = require('request');

// var segment = new Segment();
// segment.useDefault();
// var segs = segment.doSegment('第一次用手機剪片，這效果感覺真不輸電腦啊！孝文唱的真開心啊，哈哈');
// console.log(segs[0]);

var word = '你我他';

request('https://translate.google.com.tw/translate_a/single?client=t&sl=zh-CN&tl=en&hl=zh-TW&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&otf=2&ssel=0&tsel=0&tk=517318|384217&q=' + encodeURI(word), function (err, res, body){

  	if (!err && res.statusCode == 200){

		var p = 0;
		var del = false;
		while(p < body.length){
			if(body[p] == '['){
				del = true;
				p++;
			}
			else if(body[p] == ','){
				if(del){
					body = body.substring(0, p) + body.substring(p + 1, body.length);
				}
				else{
					p++;
					del = true;
				}
			}
			else{
				del = false;
				p++;
			}
		}
		// for debug
		// console.log(body);
		var object = JSON.parse(body);
		if(object[1] == 'zh-CN'){
			console.log('unknown');
		}
		else{
			for(var i = 0; i < object[1].length; i++){
				console.log(object[1][i][0]);
			}
		}
  	}
})
