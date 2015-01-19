var sentencecutter = require('./sentencecutter').cutSentence;

var sentence = '秋氣坐墊國有的房客';

sentencecutter(sentence, function(err, result){
	console.log(result);
})
