var googleTrans = require('./googletrans.js').translate,
	fs = require('fs'),
	async = require('async'),
	mongo = require('mongodb'),
	config = require('../config');



module.exports = {
	gen_by_word : function(word, cal){
		mongo.connect("mongodb://"+config.db_user+":"+config.db_passwd+"@ds063240.mongolab.com:63240/weng_e",function(err,db){
			if(err){
				console.log("error:"+err);
				return cal(null,undefined);
			}
			var collection = db.collection("terms");
			//find the term with first word match
			collection.find({"name":new RegExp(word+".*")}).toArray(function(err,terms){
				if(!terms){
					//if not found
					return cal(null,undefined);
				}else{
					var sentence_type=[['S','V','A','N'],['S','V','N']];
					var first_term = terms[Math.floor(Math.random() * terms.length)];
					var sen_type = ['V','A','N'];
					var sentence = first_term.name;
					async.eachSeries(sen_type,function(_type,callback){
						var check;
						switch(_type){
							case 'N':
								check = "noun";
								break;
							case 'A':
								check = "adjective";
								break;
							case 'V':
								check = "verb";
								break;
						}
						collection.find({type:check}).limit(500).toArray(function(err,res){
							if(err){console.log(err);callback();}
							if(res){
								//console.log(res);
								var term = res[Math.floor(Math.random() * res.length)];
								sentence = sentence + term.name;
								if(check === "adjective")sentence = sentence + "的";
								//console.log(term.name);
							}
							//console.log(check);
							callback();
						});
					},function(err){
						if(err){
							console.log("error: "+err);
							return cal(null,undefined);
						}
						db.close();	
						return cal(null,sentence);
					});
				}
			});
		});
	}
}

