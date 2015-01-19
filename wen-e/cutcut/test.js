var sentencecutter = require('./sentencecutter.js');
var terms = require("./terms"),
	async = require("async");

var sentence = '其他特殊字元沒問題';


async.series([
	function(callback){
		terms.gen_by_word("煙",callback);
	},
	function(callback){
		terms.gen_by_word("燕",callback);
	},
	function(callback){
		terms.gen_by_word("水",callback);
	},
	function(callback){
		terms.gen_by_word("中",callback);
	},
	function(callback){
		terms.gen_by_word("游",callback);
	},
],function(err,res){
	if(err)console.log(err)
	for (var i = 0; i < res.length; i++) {
		console.log(res[i])
	};
});
