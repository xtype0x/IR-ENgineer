var mongoose = require('mongoose');
var config = require('./config');

var model_req = require("./routes/model_req");
model_req.model_pipe();

mongoose.connect('mongodb://' + config.username + ':' + config.password + '@ds063240.mongolab.com:63240/weng_e');

mongoose.connection.on('error', function (err) {
	console.log(err);
});

mongoose.connection.once('open', function (){
	console.log('connection established.');
});
