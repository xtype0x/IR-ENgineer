var request = require('request');
var async = require('async');

module.exports = {
	// cut a complete sentence and return an array of terms
	cutSentence : function(sentence, callbackF){
		var loop = true;
		var resultArr = [];

		async.whilst(
		    function () { return loop; },
		    function (callback) {
		    	longestTerm4(sentence.substring(0,4), function(err, data){
					resultArr.push(data);
					if(sentence.length == data.length){
						loop = false;
					}
					sentence = sentence.substring(data.length, sentence.length);

					callback();
				});
		    },
		    function (err) {
		        callbackF(null, resultArr);
		    }
		);
	},
	
};

// find the longest term of a sentence from begin
function longestTerm(word, callbackF){

	var cond = true;
	var wordF = word;
	var result;

	async.whilst(
	    function () { return cond; },
	    function (callback) {
	    	googletrans(wordF, function(err, data){
	    		if(data != undefined){
	    			result = data;
	    			cond = false;
	    		}
	    		else{
	    			wordF = wordF.substring(0, wordF.length - 1);
	    		}
	    		callback();
	    	});
	    },
	    function (err) {
	        callbackF(null, result);
	    }
	);
}

// google translate api
function googletrans(word, callback){

    request('https://translate.google.com.tw/translate_a/single?client=t&sl=zh-CN&tl=en&hl=zh-TW&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&otf=2&ssel=0&tsel=0&tk=517318|384217&q=' + encodeURI(word), function (err, res, body){

        if (!err && res.statusCode == 200){

        	var p = 0;
        	var del = false;
        	while(p < body.length){
        		if(body[p] == '['){
        			del = true;
        			p++;
        		}
        		else if(body[p] == ','){
        			if(del){
        				body = body.substring(0, p) + body.substring(p + 1, body.length);
        			}
        			else{
        				p++;
        				del = true;
        			}
        		}
        		else{
        			del = false;
        			p++;
        		}
        	}
        	// for debug
        	// console.log(body);
        	var object = JSON.parse(body);
        	if(isNoUse(object[1])){
        		callback(null, undefined);
        	}
        	else if(isCommon(object[1])){
        		var wordData = {
        			name: word,
        			length: word.length,
        			type: ['common'],
        			rome: object[0][1][0]
        		};
        		callback(null, wordData);
        	}
        	else{
        		var wordData = {
        			name: word,
        			length: word.length,
        			type: [],
        			rome: object[0][1][0]
        		};
        		for(var i = 0; i < object[1].length; i++){
        			wordData.type.push(object[1][i][0]);
        		}
        		//console.log(wordData);
        		callback(null,wordData);
        	}
          }
    });
}

// no use
function longestTerm4(word, callback){

	googletrans(word, function(err, data){
		if(data != undefined){
			callback(null, data);
		}
		else{
			googletrans(word.substring(0, 3), function(err, data){
				if(data != undefined){
					callback(null, data);
				}
				else{
					googletrans(word.substring(0, 2), function(err, data){
						if(data != undefined){
							callback(null, data);
						}
						else{
							googletrans(word.substring(0, 1), function(err, data){
								callback(null, data);
							});
						}
					});
				}
			});
		}
	});
}

function isCommon(exp){
	var arr = ['zh-TW'];

	for(var i = 0; i < 1; i++){
		if(exp == arr[i]){
			return true;
		}
	}
	return false;
}

function isNoUse(exp){
	var arr = ['zh-CN','ja','ca','mt'];

	for(var i = 0; i < 4; i++){
		if(exp == arr[i]){
			return true;
		}
	}
	return false;
}