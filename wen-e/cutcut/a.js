var sc = require('./sentencecutter.js');

var word = '寒假基本上練球還是禮拜四跟禮拜天';

sc.longestTerm(word, function(err, result){
	console.log(result);
});

