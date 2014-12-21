var net = require('net'),
	fs = require('fs'),
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
var crawling_articles = false;
var handling_article = false;
var article = "";

//handle ptt page
conn.on('data',function(data){
	//convert the data first
	data = iconv.decode(data,'big5');
	data = data.replace(/\u001b\[H/g,'');
	//data = data.replace('\u001b[H','');
	
	//dustinguish data type
	if(data.indexOf("按任意鍵繼續") != -1){
		conn.write('\r');
		//console.log(data);
	}else if(crawling_articles){
		//handle one article
		data=data.replace(/\u001b\[[A-Z]/g,'');
		data_rows = data.split("\n");
		//for(i=1;i<data_rows.length;i++)
		//console.log(data_rows);
		article+=data;
		if(data_rows[data_rows.length-1].indexOf("100%") == -1){
			//console.log("jo~");
			conn.write('j');
		}else{
			console.log(data);
			crawling_articles=false;
		}
	}else if(data.indexOf("請輸入您的密碼:") != -1){
		console.log("entering password");
		conn.write(config.ptt_passwd+'\r');
		//console.log(data);
	}else if(data.indexOf("請輸入代號") != -1){
		//login page
		console.log("prepare to login");
		conn.write(config.ptt_user+'\r');
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
		//checking_article_info = true;
		crawling_articles=true;
		conn.write('r');
		handling_article=true;
		//while(handling_article);
		//handling_article=false;
		console.log("finish");
		/*for(i=0;i<5;i++){
			conn.write('r');
			conn.write('p');
		}*/
	}else{
		//console.log("unknown handle");
		//console.log(data);
	}
});

//end
conn.on('end',function(){
	console.log("disconnected from ptt ^^");
});