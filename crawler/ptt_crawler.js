var net = require('net'),
	fs = require('fs'),
	iconv = require('iconv-lite'),
	config = require('./config'),
	mongo = require('mongodb').MongoClient;

//init telnet connection
var conn = net.connect(23,'ptt.cc');
var inspect = require('util').inspect;
//init mongodb connection
var db_url = "mongodb://"+config.db_user+":"+config.db_passwd+"@"+config.db_host+"/"+config.db_database;
if(config.db_host === "localhost"){
	db_url = 'mongodb://'+config.db_host+'/'+config.db_database;
}


//initialize variables
var checking_article_info = false;
var crawling_articles = false;
var delete_article = false;
var loading_page = true;
var article_lines = [];
var article_title = "";
//count of crawling articles 
var cnt = 10;

//connection setting
conn.on('connect',function(){
	console.log("connected to ptt.cc ~~");
});

//handle ptt page
conn.on('data',function(data){
	//convert the data first
	data = iconv.decode(data,'big5');
	//console.log(data.replace(/\x1b[[0-9;]*[mABCDHJKsu]/g,'')+"\n--\n");
	//data = data.replace('\u001b[H','');
	//console.log("length: "+data.split("\r\n").length.toString());
	
	//handle different page
	location = cur_location(data);
	switch(location){
		case 'PRESS_CONTINUE_PAGE':
			conn.write('\r');
			break;
		case 'PASSWORD_ENTER':
			conn.write(config.ptt_passwd+'\r');
			break;
		case 'WELCOME_PAGE':
			console.log("login in to ptt....");
			conn.write(config.ptt_user+'\r');
			break;
		case 'ERRORLOG_PAGE':
			console.log("error try login exists");
			conn.write('\r');
			break;
		case 'MULTILOGIN_PAGE':
			console.log("multi login...");
			conn.write('\r');
			break;
		case 'MAIN_PAGE':
			conn.write("sgossiping\r");
			break;
		case 'GOSSIPING_PAGE':
			console.log("at gossiping page");
			if(cnt == 0){
				console.log("end crawling");
				conn.destroy();
				break;
			}
			setTimeout(function(){
				if(loading_page){
					loading_page=false;
					crawling_articles=true;
					delete_article = true;
					conn.write("r");

					setTimeout(function(){
						if(delete_article){
							console.log("article not exists");
							crawling_articles=false;
							loading_page = true;
							conn.write("k\f");
						}
					},500);
				}
			},1000);
			break;
		case 'CRAWLING_ARTICLE':
			delete_article=false;
			data = data.replace(/\x1b[[0-9;]*[mABCDHJKsu]/g,'');
			lines = data.split("\n");
			if(lines[lines.length-1].indexOf("100%") != -1){
				crawling_articles = false;
				article_lines = article_lines.slice(4);
				article = article_lines.join("\n");
				article = article.split("※ 發信站: 批踢踢實業坊")[0];
				//save in mongodb
				mongo.connect(db_url,function(err,db){
					if(err){
						console.log(err);
					}else{
						//insert the article into db
						var collection = db.collection("ptt_articles");
						collection.insert({
							title:article_title,
							article:article.replace(/\n+/g,"\n"),
							create_time: new Date()
						},function(err,result){
							if(err){
								console.log(err);
							}else{
								console.log("save article in mongodb");
								article_lines = [];
								crawling_articles = false;
								loading_page = true;
								conn.write("qk");
								cnt = cnt-1;
								console.log("done");
							}
						});
					}
				});
				//console.log(article);
			}else{
				if(article_lines.length == 0){
					//lines = (data.replace(/\x1b[[0-9;]*[mABCDHJKsu]/g,'')).split("\n");
					article_lines = lines.slice(0,lines.length-1);
					article_title = lines[1].replace("標題","");
					//console.log("title: "+article_title);
				}else{
					//console.log(lines.length);
					//if(lines[lines.length-2] === article_lines[article_lines.length-1])
					article_lines.push(lines[lines.length-2]);
					//else{
					//	article_lines.push('');
					//}
				}
				conn.write('j');
			}
			break;
		default:
			break;
	}

});

//end
conn.on('end',function(){
	console.log("disconnected from ptt ^^");
});


//functions
function cur_location(data){
	if(data.indexOf("任意鍵繼續") != -1)
		return 'PRESS_CONTINUE_PAGE'; 

	if(crawling_articles)
		return 'CRAWLING_ARTICLE';

	if(data.indexOf("請輸入您的密碼:") != -1)
		return 'PASSWORD_ENTER';

	var check = ["密碼正確！開始登入系統...","正在檢查密碼...","會需時較久...","請稍後...","正在更新與同步線上使用者"];
	for(i=0;i<check.length;i++)
		if(data.indexOf(check[i]) != -1)return 'SYSTEM_TMP_PAGE';

	if(data.indexOf("密碼不對喔") != -1 || data.indexOf("請重新輸入") != -1)
		return 'LOGIN_RETRY_PAGE';

	if(data.indexOf("確定要填寫註冊單") != -1)
		return 'INTERACTIVE_PAGE';

	if(data.indexOf("刪除其他重複登入的連線嗎") != -1)
		return 'MULTILOGIN_PAGE';

	if(data.indexOf("刪除以上錯誤嘗試的記錄嗎") != -1)
		return 'ERRORLOG_PAGE';

	if((data.indexOf("歡迎來到")!= -1 || data.indexOf("批踢踢") != -1 || data.indexOf("輸入代號") != -1) &&
		data.indexOf("以 guest 參觀") != -1 && data.indexOf("以 new 註冊") != -1)
		return 'WELCOME_PAGE';


	if( data.indexOf("┌─────────────────────────────────────┐") != -1 &&
		data.indexOf("│ 文章代碼(AID):") != -1 &&
		data.indexOf("這一篇文章值") != -1 &&
		data.indexOf("└─────────────────────────────────────┘") != -1)
		return 'ARTICLE_DETAIL';

	if(data.indexOf("主功能表") != -1)
		return 'MAIN_PAGE';

	if(data.indexOf("看板《Gossiping》") != -1)
		return 'GOSSIPING_PAGE';
	
	return 'UNKNOWN';
}
