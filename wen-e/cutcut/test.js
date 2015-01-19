var googleTrans = require('./googletrans.js').translate,
	fs = require('fs'),
	async = require('async'),
	mongo = require('mongodb');

// var Segment = require('node-segment').Segment;
// var segment = new Segment();
// segment.useDefault();
// var segs = segment.doSegment('第一次用手機剪片，這效果感覺真不輸電腦啊！孝文唱的真開心啊，哈哈');
// console.log(segs[0]);


/*

parse the terms file
*/
// words_set = [];
// data = fs.readFileSync("word/1.xml",'utf-8').split("\n");
// console.log("parsing terms.....");
// for (var i = 0; i < data.length; i++) {
// 	if(data[i].indexOf("<example>") != -1){
// 		words = data[i].replace("<example>","").replace(",</example>","");
// 		//console.log(words)
// 		word_list = words.split(",");
// 		for(j=0;j<word_list.length;j++){
// 			word = word_list[j].split("(")[0];

// 			async.series([function(callback){
// 				googleTrans(word,callback);
// 			}],function(err,result){
// 				word_data = result[0];
// 				if(word_data === "unknown")
// 					words_set.push(word_data);
// 				console.log(word_data);
// 			});
			
			
// 		}

// 	}
// };
console.log("loading...");
words_set = [];
data = fs.readFileSync("words.txt",'utf-8').split("\n");

async.each(data,function(word,callback){
	async.series([function(callback2){
		googleTrans(word,callback2);
	}],function(err,res){
		if(res[0] != undefined){
			console.log(res[0]);
			words_set.push(res[0]);
		}
		callback();
	});
},function(err){
	mongo.connect("mongodb://ENgineer:enen@ds063240.mongolab.com:63240/weng_e",function(err,db){
		if(err)console.log(err);
		else{
			var col = db.collection('terms');
			col.insert(words_set,function(err,result){
				if(err)
					console.log(err)
				else
					console.log("success");
				db.close();
			});
			
		}
	});
	// for(i=0;i<results.length;i++){
	// 	if(results[i] == undefined)console.log("ya");
	// }
	//console.log(words_set);
});


