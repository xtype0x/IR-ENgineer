var sentencecutter = require('./sentencecutter.js');
var terms = require("./terms"),
	async = require("async");

var sentence = '寒假基本上練球還是禮拜四跟禮拜天';


async.series([
	function(callback){
		terms.gen_by_word("秋",callback);
	}
],function(err,res){
	console.log(res[0]);
});

