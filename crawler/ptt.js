var net = require('net'),
	iconv = require('iconv-lite'),
	keypress = require('./keypress');


var conn = net.connect(23,'ptt.cc');
var inspect = require('util').inspect;

//key process setting
keypress(process.stdin);
process.stdin.on('keypress',function(ch,key){
	if (key && key.ctrl && key.name == 'c') {
        process.exit();
    }
    conn.write(key.sequence);
});

process.stdin.setRawMode(true);
process.stdin.resume();

//connection setting
conn.on('connect',function(){
	console.log("connected to ptt.cc ~~");
});

conn.on('data',function(data){
	data = iconv.decode(data,'big5');
	console.log(data);

});

//end
conn.on('end',function(){
	console.log("disconnected from ptt ^^");
});