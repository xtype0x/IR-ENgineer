var googleTrans = require('./googletrans.js').translate,
	fs = require('fs'),
	async = require('async'),
	mongo = require('mongodb');



module.exports = {
	gen_by_word : function(word, cal){
		mongo.connect("mongodb://ENgineer:enen@ds063240.mongolab.com:63240/weng_e",function(err,db){
			if(err){
				db.close();
				return cal(err,"err1");
			}
			var collection = db.collection("terms");
			//find the term with first word match
			collection.find({"name":new RegExp("^"+word+".*")}).toArray(function(err,terms){
				if(err){db.close();return cal(err,"err2");}
				if(terms.length == 0){
					//if not found
					//return cal(null,undefined);
					var first_term = {"name":word};
				}else{
					var sentence_type=[['S','V','A','N'],['S','V','N']];
					var first_term = terms[Math.floor(Math.random() * terms.length)];
				}
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
							if(check === "adjective" && Math.floor((Math.random() * 10) + 1) > 6)sentence = sentence + "的";
							//console.log(term.name);
						}
						//console.log(check);
						callback();
					});
				},function(err){
					if(err){
						return cal(err,"err3");
					}
					db.close();	
					return cal(null,sentence);
				});
				
			});
		});
	}
}

