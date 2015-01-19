// 對sentence這個collection做處理


var mongoose = require('mongoose');
var _ = require('underscore');


var ptt_article = mongoose.model('ptt_article');
var sentence = mongoose.model('sentence');

exports.article_list = function(req, res){
// 列出所有的articel list
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
//列出所有的sentence list
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
//把文章切成句子
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
            each_article.title = each_article.title.replace("\r","");
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


exports.search_word = function(req, res){
    //搜尋符合字串的句子

    console.log(req.body.string);
    // console.log(string[0]);
    var arr = [];
    _.each(string,function(val){
        arr.push(search_db(val));
    });

    // sentence.find({ content : },null,{
    //     sort:{
    //         date_added: -1 //Sort by Date Added DESC
    //     }
    // }, function(err, data) {
    //     if (err) throw err;
    //     res.json({sentence_list:data});
    // });  
    // var firstword = string[0];

    // sentence.findOne({content: new RegExp('^search_word'+firstword+'.*')}, function(err, data) {



//db.terms.find({$where:"this.rome.length=5"}).limit(-1).skip(Math.floor(db.terms.count()*Math.random())).next()




};


function search_db(word){

    sentence.find({"content": new RegExp("^"+word+".*")}, function(err, data) {
        if(err) console.log(err);
        if(data!=null){
            console.log(data[(Math.floor((data.length)*Math.random())%data.length)].content);
            return data[(Math.floor((data.length)*Math.random())%data.length)].content;

        }
        else{
          // console.log(data);
        // //get kens' api
        //     sentence.find(({$where:"this.rome.length=5"}).limit(-1).skip(Math.floor(db.sentence.count()*Math.random())).next(),function(err, data) {

        //     }
        }
    });
}
