var sentencecutter = require('./sentencecutter.js');
var terms = require("./terms"),
	async = require("async");

var sentence = '寒假基本上練球還是禮拜四跟禮拜天';


async.series([
	function(callback){
		terms.gen_by_word("我",callback);
	},
	function(callback){
		terms.gen_by_word("是",callback);
	},
	function(callback){
		terms.gen_by_word("陳",callback);
	},
	function(callback){
		terms.gen_by_word("秋",callback);
	},
	function(callback){
		terms.gen_by_word("中",callback);
	},
],function(err,res){
	if(err)console.log(err)
	for (var i = 0; i < res.length; i++) {
		console.log(res[i])
	};
});