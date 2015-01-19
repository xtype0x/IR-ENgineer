var sentencecutter = require('./sentencecutter.js');
var terms = require("./terms"),
	async = require("async");

var sentence = '其他特殊字元沒問題';


async.series([
	function(callback){
		terms.gen_by_word("秋",callback);
	}
],function(err,res){
	console.log(res[0]);
});

