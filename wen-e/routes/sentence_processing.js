// 對sentence這個collection做處理


var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');
var sc = require('../cutcut/sentencecutter.js');

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
            var str = "";

            each_article.title = each_article.title.replace("\r","");

            var count = 0;

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
                        callback(each_article.title,elem,count);
                        count++;
                     }
                  });
                  str = "";
               } 				
   			});                      
   		});
   		res.json(json_arr);
    });


};


exports.search_word = function(req, res){
    //搜尋符合字串的句子

    // console.log(req.body.string);
    // console.log(string[0]);
    var arr = [];
    var string = "中秋節快樂";

    async.eachSeries(string,function(val,call){
      // console.log("o asy");
      async.series([
        function(callback){
          // console.log("asy");
          search_db(val,callback);
        }
      ],function(err,res){
        // console.log("res");
        arr.push(res[0]);
        call();
      });
    },function(err){
      return res.json(arr);
    });
    // async.eachSeries(string,function(val,call){
    //   async.series([
    //     function(callback){
    //       search_db(val,string.indexOf(val),arr);
    //     }
    //   ],function(err,res){
    //     console.log(res[0]);
    //     arr.push(res[0])
    //     call();
    //   });
    // },function(err){
    //   return res.json(arr);
    // });
    // _.each(string,function(val,idx){

    //     search_db(val,string.indexOf(val),arr);
        
    //     if(string.indexOf(val)==(string.length-1)){
    //         console.log("fin");
    //         res.json(arr);
    //     };
    //   // console.log(val,string.indexOf(val),arr);
        
    // });
    // console.log(arr);
    // res.json(arr);
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


function search_db(word,cal){
    // console.log(word);
    sentence.find({"content": new RegExp("^"+word+".*")}, function(err, data) {
        var ans="";
        if(err) console.log(err);
        if(data.length!==0){

          // console.log(data.length);
              if(data[(Math.floor((data.length)*Math.random())%data.length)]!=undefined){
                 ans = data[(Math.floor((data.length)*Math.random())%data.length)].content;
                 return cal(null,ans);
              }

        }
        else{

          // //get kens' api
          // console.log("138");
            sc.googleTransAPI(word, function(err, result){
                if (result != undefined) {
                  // console.log(idx);
                  sentence.find({"rome": result.rome }, function(err, data) {
                    if(data.length!==0){
                        if(data[(Math.floor((data.length)*Math.random())%data.length)].content!=undefined){
                          ans = data[(Math.floor((data.length)*Math.random())%data.length)].content;
                          return cal(null,ans);
                        }
                    }
                    else{
                        return cal(null,"no data");
                    }
                      
                  });
                }
                else{
                  return cal(null,"no data");
                }
            });

        
        //     sentence.find(({$where:"this.rome.length=5"}).limit(-1).skip(Math.floor(db.sentence.count()*Math.random())).next(),function(err, data) {

        //     }
        }
    });

};

function callback (title,sentence_word,count) {
      sc.googleTransAPI(sentence_word[0], function(err, result){
                           if (result != undefined) {
                              console.log(result.rome);
                              // json_arr.push({"content":sentence,"from":each_article.title, "index": count, "rome": result.rome});
                              // console.log(json_arr);
                              sentence.update({"content":sentence_word,"from":title, "index": count, "rome": result.rome}, {$set:{"content":sentence_word,"from":title, "index": count, "rome": result.rome}}, {upsert:true}, function(err){
                                 if(err) throw err;
                                 console.log('update ' + title + ' success');
                              });
                           }
                        });
};
