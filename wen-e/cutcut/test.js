var sentencecutter = require('./sentencecutter.js');


var sentence = '寒假基本上練球還是禮拜四跟禮拜天';


sentencecutter.cutSentence(sentence, function(err, result){
	console.log(result);
});