var mongoose = require('mongoose');
var _ = require('underscore');


var ptt_article = mongoose.model('ptt_article');
var sentence = mongoose.model('sentence');

exports.article_list = function(req, res){

   	ptt_article.find({},null,{
	    // skip:0, // Starting Row
	    // limit:3, // Ending Row
	    sort:{
	        date_added: -1 //Sort by Date Added DESC
	    }
	}, function(err, data) {
   		if (err) throw err;
		console.log(data);
		res.json({article_list:data});
    });

};


exports.article_to_sentence = function(req, res){

	var arr = [];

   	ptt_article.find({},null,{
	    skip:0, // Starting Row
	    limit:3, // Ending Row
	    // sort:{
	    //     date_added: -1 //Sort by Date Added DESC
	    // }
	}, function(err, data) {
   		if (err) throw err;
   		// console.log(data);
   		_.each(data,function(val){
            var str = "";
   			// var article_part = val.article.split("\r\n");
   			_.each(val.article.split("\r\n"),function(line){
   				// console.log(":"+elem);
               str += line;
               if (line.length >= 39) {
                  
               }
               else{
                  console.log(str);
                  str = "";
                  console.log(str);
               }
   				
   				// var per_line = line.replace(/^[\u0391-\uFFE5]+$/g,"");
   				// if(per_line!=""){
   				// 	// console.log("per_line :");
   				// 	console.log(per_line);
   				// 	// str+=per_line;
   				// 	// _.each(per_line.split(/[\uff0c\u3002]/),function(elem){
   				// 	// 	if(elem!=""){
   							
   				// 	// 		// all.concat(elem);
   				// 	// 	}
   						
   				// 	// });
   					
   				// 	// console.log(per_line.split(/[\uff0c\u3002]/));

   				// }
   				// console.log(str);
   				// 
   			});
   			// console.log(article_part[0].replace(/^[\u0391-\uFFE5]+$/g,""));
   			// arr.push({"part":article_part,"from":val.title});
   		});
   		// res.json(arr));
    });


};