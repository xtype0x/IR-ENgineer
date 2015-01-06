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
var delete_article = false;
var article_lines = [];
var article_title = "";


//handle ptt page
conn.on('data',function(data){
	//convert the data first
	data = iconv.decode(data,'big5');
	
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
			crawling_articles=true;
			delete_article = true;
			conn.write("r");
			setTimeout(function(){
				if(delete_article){
					console.log("article not exists");
					conn.write("k\f");
					crawling_articles=false;
				}
			},500);
			break;
		case 'CRAWLING_ARTICLE':
			data = data.replace(/\x1b[[0-9;]*[mABCDHJKsu]/g,'');
			delete_article=false;
			lines = data.split("\n");
			if(lines[lines.length-1].indexOf("100%") != -1){
				crawling_articles = false;
				article = article_lines.join("\n");
				fs.writeFile('article.txt', article, function (err) {
				  if (err) throw err;
				  console.log('It\'s saved!');
				});
				console.log("done");
				//console.log(article);
				article_lines = [];
			}else{
				if(article_lines.length == 0){
					//lines = (data.replace(/\x1b[[0-9;]*[mABCDHJKsu]/g,'')).split("\n");
					article_lines = lines.slice(0,lines.length-1);
					article_title = lines[1].replace("標題","");
					console.log("title: "+article_title);
				}else{
					console.log(lines.length);
					//handle sending one line article
					if(lines.length == 3){

					}
					if(lines[lines.length-2] === article_lines[article_lines.length-1])
						article_lines.push(lines[lines.length-2]);
					else{
						article_lines.push('');
					}
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

function cur_location(data){
	if(data.indexOf("任意鍵繼續") != -1)
		return 'PRESS_CONTINUE_PAGE'; 

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

	if(data.indexOf("請輸入您的密碼:") != -1)
		return 'PASSWORD_ENTER';

	if((data.indexOf("歡迎來到")!= -1 || data.indexOf("批踢踢") != -1 || data.indexOf("輸入代號") != -1) &&
		data.indexOf("以 guest 參觀") != -1 && data.indexOf("以 new 註冊") != -1)
		return 'WELCOME_PAGE';


	if( data.indexOf("┌─────────────────────────────────────┐") != -1 &&
		data.indexOf("│ 文章代碼(AID):") != -1 &&
		data.indexOf("這一篇文章值") != -1 &&
		data.indexOf("└─────────────────────────────────────┘") != -1)
		return 'ARTICLE_DETAIL';

	if(data.indexOf("主功能表") != -1 && data.indexOf("分組討論區") != -1)
		return 'MAIN_PAGE';

	if(data.indexOf("看板《Gossiping》") != -1)
		return 'GOSSIPING_PAGE';

	if(crawling_articles)
		return 'CRAWLING_ARTICLE';
	
	return 'UNKNOWN';
}
