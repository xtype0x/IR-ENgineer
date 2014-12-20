var net = require('net'),
	iconv = require('iconv-lite'),
	config = require('./config');


var conn = net.connect(23,'ptt.cc');
var inspect = require('util').inspect;


//connection setting
conn.on('connect',function(){
	console.log("connected to ptt.cc ~~");
});

//initialize variables
var checking_article_info = false;

//handle ptt page
conn.on('data',function(data){
	//convert the data first
	data = iconv.decode(data,'big5');

	//dustinguish data type
	if(checking_article_info){
		//read the article info 
		data_rows = data.split("\n");
		console.log(data_rows);
		checking_article_info = false;
	}else if(data.indexOf("請輸入您的密碼:") != -1){
		console.log("entering password");
		conn.write(config.ptt_passwd+'\r');
		//console.log(data);
	}else if(data.indexOf("請輸入代號") != -1){
		//login page
		console.log("prepare to login");
		conn.write(config.ptt_user+'\r');
	}else if(data.indexOf("請按任意鍵繼續") != -1){
		conn.write('\r');
		//console.log(data);
	}else if(data.indexOf("您要刪除以上錯誤嘗試的記錄嗎?") != -1){
		console.log("error try exists!!");
		conn.write('\r');
	}else if(data.indexOf("您想刪除其他重複登入的連線嗎？") != -1){
		conn.write('\r');
	}else if(data.indexOf("主功能表") != -1){
		//main page
		//go to Gossiping page
		conn.write("s");
		conn.write("gossiping\r");
	}else if(data.indexOf("看板《Gossiping》") != -1){
		console.log("at gossiping now");
		checking_article_info = true;
		conn.write('Q');
	}else{
		//console.log(data);
	}
});

//end
conn.on('end',function(){
	console.log("disconnected from ptt ^^");
});