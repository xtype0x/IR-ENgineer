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

exports.sentence_list = function(req, res){

      sentence.find({},null,{
       // skip:0, // Starting Row
       // limit:3, // Ending Row
       sort:{
           date_added: -1 //Sort by Date Added DESC
       }
   }, function(err, data) {
         if (err) throw err;
      // console.log(data);
      res.json({sentence_list:data});
    });

};


exports.article_to_sentence = function(req, res){

	var json_arr = [];

   	ptt_article.find({},null,{
	    // skip:0, // Starting Row
	    // limit:3, // Ending Row
	    sort:{
	        date_added: -1 //Sort by Date Added DESC
	    }
	}, function(err, data) {
   		if (err) throw err;
   		// console.log(data);
   		_.each(data,function(each_article){
            var arr = [];
            var str = "";
   			// var article_part = val.article.split("\r\n");
   			_.each(each_article.article.split("\r\n"),function(line){
   				// console.log(":"+elem);
               str += line;
               if (line.length >= 39) {
                  
               }
               else{
                  var part = str.split(/[\u3002|\uFF1F|\uFF01|\uFF0C|\u3001|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2013|\u2014|\u2026|\uFF3C|\uFF0F|\uFF1B|\uFF1A|\n|\s|\t|\r]/g);
                  _.each(part,function(elem){
                     if(elem != ""){
                        // console.log(elem);
                        arr.push(elem);
                     }
                  });
                  // console.log(arr);
                  // console.log(str);
                  str = "";
                  // console.log(str);
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
            console.log(arr);
   			// console.log(article_part[0].replace(/^[\u0391-\uFFE5]+$/g,""));
   			json_arr.push({"content":arr,"from":each_article.title});
            sentence.update({"content":arr,"from":each_article.title}, {$set: {"content":arr,"from":each_article.title}}, {upsert:true}, function(err){
               if(err) throw err;
               console.log('update ' + each_article.title + ' success');
            });
   		});
   		res.json(json_arr);
    });


};


function callback(){
   console.log("update");
}