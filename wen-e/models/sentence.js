var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SentenceSchema = new Schema({
	from: { type: String, required: true },
	sentence: { type: String, required: true },
},
{ collection : 'sentence' }
);

var sentence = mongoose.model('sentence', SentenceSchema);