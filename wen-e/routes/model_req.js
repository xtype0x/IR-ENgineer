var path = require('path');

//include all models in dir "models"
exports.model_pipe = function(){

	var ModelPath = path.join(__dirname, "../models");
	

	require("fs").readdirSync(ModelPath).forEach(function(file) {
	
		if (file.match(/.+\.js/g)){
			console.log("load model:"+file.replace(/\.js/g,""));
			return require("../models/"+file);
		}
		
	});
}