var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Ptt_articleSchema = new Schema({
	title: { type: String, required: true },
	article: { type: String, required: true },
},
{ collection : 'ptt_articles' }
);

var ptt_article = mongoose.model('ptt_article', Ptt_articleSchema);
