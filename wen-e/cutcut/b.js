var request = require('request');
var async = require('async');

var cond = true;
var word = '寒假基';
var result;

async.whilst(
    function () { return cond; },
    function (callback) {
    	googletrans(word, function(err, data){
    		if(data != undefined){
    			result = data;
    			cond = false;
    		}
    		else{
    			word = word.substring(0, word.length - 1);
    		}
    		callback();
    	});
    },
    function (err, data) {
        console.log(result);
    }
);
// var count = 0;

// async.whilst(
//     function () { return cond; },
//     function (callback) {
//         count++;
//         console.log('a');
//         if(count == 10){
//         	cond = false;
//         }
//         setTimeout(callback, 1000);
//     },
//     function (err) {
//         // 5 seconds have passed
//     }
// );


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
        	if(object[1] == 'zh-CN'){
        		callback(null, undefined);
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