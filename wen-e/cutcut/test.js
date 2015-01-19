var sentencecutter = require('./sentencecutter.js');


var sentence = '其他特殊字元沒問題';


sentencecutter.cutSentence(sentence, function(err, result){
	console.log(result);
});