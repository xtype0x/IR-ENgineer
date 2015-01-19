
/*
 * GET home page.
 */

var async = require('async'),
	terms = require('../cutcut/terms');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.generate = function(req,res){
	sentence = req.body.s;
	console.log(sentence);
	s = [];
	async.eachSeries(sentence.split(""),function(word,call){
		async.series([
			function(callback){
				terms.gen_by_word(word,callback);
			}
		],function(err,res){
			s.push(res[0])
			call();
		});
	},function(err){
		return res.json(s);
	});
}
