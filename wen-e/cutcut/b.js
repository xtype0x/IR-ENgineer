var sentencecutter = require('./sentencecutter').cutSentence;

var sentence = '這個話題夠久了吧還說啊真的好久沒去政大了欸有沒有一年啊阿你們放假了我去也沒人啊';

sentencecutter(sentence, function(err, result){
	console.log(result);
})
